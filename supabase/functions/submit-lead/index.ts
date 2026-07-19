import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFY = ["bruce.m@securepathconsulting.co.za", "william.d@securepathconsulting.co.za"];

const TOOL_NAMES: Record<string, string> = {
  "popia-fine-calculator": "POPIA Fine Calculator (fine reduction plan)",
  "privacy-policy-generator": "Privacy Policy Generator (implementation pack)",
  "dsar-deadline-calculator": "DSAR Deadline Calculator (letter pack)",
  "breach-notification-checker": "Breach Notification Checker (72-hour response plan)",
  "vendor-risk-scorecard": "Vendor Risk Scorecard (remediation pack)",
  "information-officer-checker": "Information Officer Checker (first-90-days pack)",
  "cookie-scanner": "Cookie Scanner (compliance fix plan)",
};

const esc = (s: string): string =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { tool, email, name, company, context } = await req.json();

    if (!tool || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid submission" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: dbError } = await supabase.from("tool_leads").insert({
      tool,
      email,
      name: name || null,
      company: company || null,
      context: context || null,
    });
    if (dbError) {
      console.error("tool_leads insert failed:", dbError.message);
      return json({ error: "Could not save" }, 500);
    }

    // Notification email — lead is saved even if this fails.
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const toolName = TOOL_NAMES[tool] || tool;
      const html = `
        <h2 style="font-family:sans-serif">New tool lead — ${esc(toolName)}</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0"><b>Name</b></td><td>${esc(name || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><b>Company</b></td><td>${esc(company || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><b>Email</b></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:4px 12px 4px 0;vertical-align:top"><b>Their answers</b></td>
              <td><pre style="font-family:monospace;font-size:12px;background:#f4f4f4;padding:8px;border-radius:4px">${esc(JSON.stringify(context || {}, null, 2))}</pre></td></tr>
        </table>
        <p style="font-family:sans-serif;color:#666;font-size:13px">Captured on securepathconsulting.co.za/tools/${esc(tool)}/</p>`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "SecurePath Tools <tools@mail.securepathconsulting.co.za>",
          to: NOTIFY,
          subject: `New lead: ${name || email} — ${toolName}`,
          html,
        }),
      });
      if (!res.ok) {
        console.error("Resend failed:", res.status, await res.text());
      }
    } else {
      console.error("RESEND_API_KEY not configured — lead saved, no notification sent");
    }

    return json({ ok: true });
  } catch (e) {
    console.error("submit-lead error:", e);
    return json({ error: "Bad request" }, 400);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
