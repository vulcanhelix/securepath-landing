import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Section {
  heading?: string;
  body?: string[];
  subheadings?: Array<{ title: string; body: string }>;
  list_items?: string[];
}

/**
 * Ensure text ends with sentence-ending punctuation so TTS
 * produces a natural pause rather than running into the next segment.
 */
function ensureTrailingPunctuation(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (/[.!?;:]$/.test(trimmed)) return trimmed;
  return trimmed + ".";
}

/**
 * Flatten JSONB content array into natural, TTS-friendly plain text.
 * Adds pauses and transitions so the audio sounds narrated, not read.
 */
function contentToText(content: Section[], title: string): string {
  const parts: string[] = [];

  if (title) {
    parts.push(title + ".\n");
  }

  for (let i = 0; i < content.length; i++) {
    const section = content[i];

    if (section.heading) {
      parts.push(section.heading + ".\n");
    }

    if (section.body) {
      for (const para of section.body) {
        parts.push(ensureTrailingPunctuation(para));
      }
    }

    if (section.subheadings) {
      for (const sub of section.subheadings) {
        parts.push(sub.title + ".");
        parts.push(ensureTrailingPunctuation(sub.body));
      }
    }

    if (section.list_items) {
      for (const item of section.list_items) {
        parts.push(ensureTrailingPunctuation(item));
      }
    }

    // Extra line break between major sections for a longer spoken pause
    if (i < content.length - 1) {
      parts.push("");
    }
  }

  return parts.join("\n\n");
}

/**
 * Split text into chunks of roughly maxChars, breaking on paragraph boundaries.
 */
function chunkText(text: string, maxChars = 1800): string[] {
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }
    current += (current ? "\n\n" : "") + para;
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();

    if (!slug || typeof slug !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid slug" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const DEEPGRAM_API_KEY = Deno.env.get("DEEPGRAM_API_KEY");
    if (!DEEPGRAM_API_KEY) {
      throw new Error("DEEPGRAM_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the article
    const { data: post, error: fetchError } = await supabase
      .from("insights")
      .select("id, slug, title, content, audio_url")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, error: "Article not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Cache hit — audio already exists
    if (post.audio_url) {
      return new Response(
        JSON.stringify({ success: true, audio_url: post.audio_url }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract and chunk text
    const fullText = contentToText(post.content as Section[], post.title);
    const chunks = chunkText(fullText);

    console.log(
      `Generating audio for "${post.title}": ${fullText.length} chars, ${chunks.length} chunks`
    );

    // Call Deepgram sequentially (legacy models are fast, ~2s per chunk)
    const audioChunks: Uint8Array[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(
        `Processing chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`
      );

      const response = await fetch(
        "https://api.deepgram.com/v1/speak?model=aura-helios-en&encoding=mp3",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: chunks[i] }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Deepgram API error (chunk ${i + 1}): ${response.status} — ${errorBody}`
        );
      }

      audioChunks.push(new Uint8Array(await response.arrayBuffer()));
    }

    // Concatenate MP3 chunks (MP3 is frame-based, raw concat works)
    const totalLength = audioChunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Upload to Supabase Storage
    const filePath = `${slug}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("article-audio")
      .upload(filePath, combined, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Construct public URL and update the insights row
    const audioUrl = `${SUPABASE_URL}/storage/v1/object/public/article-audio/${filePath}`;

    const { error: updateError } = await supabase
      .from("insights")
      .update({ audio_url: audioUrl, updated_at: new Date().toISOString() })
      .eq("id", post.id);

    if (updateError) throw updateError;

    console.log(`Audio generated and stored: ${audioUrl}`);

    return new Response(
      JSON.stringify({ success: true, audio_url: audioUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating audio:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
