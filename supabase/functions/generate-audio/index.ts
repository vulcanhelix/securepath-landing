import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DEFAULT_OPENAI_TTS_MODEL = "gpt-4o-mini-tts-2025-12-15";
const DEFAULT_OPENAI_TTS_VOICE = "cedar";
const DEFAULT_OPENAI_TTS_INSTRUCTIONS =
  "Narrate in natural, polished South African English. Sound like a professional South African compliance consultant. Keep the delivery clear, warm, measured, and non-theatrical.";

const TTS_NORMALIZATIONS = [
  { pattern: /\bM365\b/g, replacement: "Microsoft 365" },
  { pattern: /\bPOPIA\b/g, replacement: "P O P I A" },
  { pattern: /\bGDPR\b/g, replacement: "G D P R" },
  { pattern: /\bDSAR\b/g, replacement: "D S A R" },
  { pattern: /\bPDPL\b/g, replacement: "P D P L" },
  { pattern: /\bDBE\b/g, replacement: "D B E" },
];

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

interface InsightPost {
  id: string;
  slug: string;
  title: string;
  content: Section[];
  audio_url?: string | null;
  audio_provider?: string | null;
  audio_model?: string | null;
  audio_voice?: string | null;
  audio_version?: string | null;
}

function getRequiredEnv(name: string, fallback?: string): string {
  const value = Deno.env.get(name) ?? fallback;
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
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

function normalizeTextForTts(text: string): string {
  return TTS_NORMALIZATIONS.reduce(
    (normalized, rule) => normalized.replace(rule.pattern, rule.replacement),
    text
  );
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

    const OPENAI_API_KEY = getRequiredEnv("OPENAI_API_KEY");
    const OPENAI_TTS_MODEL = getRequiredEnv(
      "OPENAI_TTS_MODEL",
      DEFAULT_OPENAI_TTS_MODEL
    );
    const OPENAI_TTS_VOICE = getRequiredEnv(
      "OPENAI_TTS_VOICE",
      DEFAULT_OPENAI_TTS_VOICE
    );
    const OPENAI_TTS_INSTRUCTIONS = getRequiredEnv(
      "OPENAI_TTS_INSTRUCTIONS",
      DEFAULT_OPENAI_TTS_INSTRUCTIONS
    );
    const OPENAI_TTS_VERSION = getRequiredEnv(
      "OPENAI_TTS_VERSION",
      `openai-${OPENAI_TTS_MODEL}-${OPENAI_TTS_VOICE}-za-v1`
    );
    const SUPABASE_URL = getRequiredEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = getRequiredEnv(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the article
    const { data: rawPost, error: fetchError } = await supabase
      .from("insights")
      .select(
        "id, slug, title, content, audio_url, audio_provider, audio_model, audio_voice, audio_version"
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const post = rawPost as InsightPost | null;

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
    if (post.audio_url && post.audio_version === OPENAI_TTS_VERSION) {
      return new Response(
        JSON.stringify({ success: true, audio_url: post.audio_url }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract and chunk text
    const fullText = normalizeTextForTts(
      contentToText(Array.isArray(post.content) ? post.content : [], post.title)
    );
    const chunks = chunkText(fullText);

    console.log(
      `Generating audio for "${post.title}": ${fullText.length} chars, ${chunks.length} chunks`
    );

    // Call OpenAI sequentially so long-form articles can be stitched together.
    const audioChunks: Uint8Array[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(
        `Processing chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`
      );

      const response = await fetch(
        "https://api.openai.com/v1/audio/speech",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENAI_TTS_MODEL,
            voice: OPENAI_TTS_VOICE,
            instructions: OPENAI_TTS_INSTRUCTIONS,
            input: chunks[i],
            response_format: "mp3",
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `OpenAI speech API error (chunk ${i + 1}): ${response.status} — ${errorBody}`
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
    const filePath = `${slug}/${OPENAI_TTS_VERSION}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("article-audio")
      .upload(filePath, combined, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Construct public URL and update the insights row
    const audioUrl = `${SUPABASE_URL}/storage/v1/object/public/article-audio/${filePath}`;
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("insights")
      .update({
        audio_url: audioUrl,
        audio_provider: "openai",
        audio_model: OPENAI_TTS_MODEL,
        audio_voice: OPENAI_TTS_VOICE,
        audio_version: OPENAI_TTS_VERSION,
        audio_generated_at: now,
        updated_at: now,
      })
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
    const message =
      error instanceof Error ? error.message : "Unknown error generating audio";

    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
