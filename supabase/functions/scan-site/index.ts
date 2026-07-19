import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TrackerSig {
  name: string;
  category: string;
  pattern: RegExp;
}

const SIGNATURES: TrackerSig[] = [
  { name: "Google Analytics", category: "Analytics", pattern: /google-analytics\.com|googletagmanager\.com\/gtag|gtag\(/i },
  { name: "Google Tag Manager", category: "Tag manager", pattern: /googletagmanager\.com\/gtm|GTM-[A-Z0-9]+/i },
  { name: "Google Ads / DoubleClick", category: "Advertising", pattern: /doubleclick\.net|googleadservices\.com|googlesyndication/i },
  { name: "Meta (Facebook) Pixel", category: "Advertising", pattern: /connect\.facebook\.net|fbq\(|facebook\.com\/tr/i },
  { name: "LinkedIn Insight Tag", category: "Advertising", pattern: /snap\.licdn\.com|linkedin\.com\/px|_linkedin_partner_id/i },
  { name: "TikTok Pixel", category: "Advertising", pattern: /analytics\.tiktok\.com|ttq\.load/i },
  { name: "X (Twitter) Pixel", category: "Advertising", pattern: /static\.ads-twitter\.com|twq\(/i },
  { name: "Hotjar", category: "Session recording", pattern: /static\.hotjar\.com|hj\(/i },
  { name: "Microsoft Clarity", category: "Session recording", pattern: /clarity\.ms|clarity\(/i },
  { name: "HubSpot", category: "Marketing automation", pattern: /js\.hs-scripts\.com|hubspot\.com/i },
  { name: "Mailchimp", category: "Marketing automation", pattern: /chimpstatic\.com|list-manage\.com/i },
  { name: "Intercom", category: "Chat / support", pattern: /widget\.intercom\.io|intercomSettings/i },
  { name: "Drift", category: "Chat / support", pattern: /js\.driftt\.com/i },
  { name: "Tawk.to", category: "Chat / support", pattern: /embed\.tawk\.to/i },
  { name: "Crisp", category: "Chat / support", pattern: /client\.crisp\.chat/i },
  { name: "Segment", category: "Data platform", pattern: /cdn\.segment\.com|analytics\.load/i },
  { name: "Mixpanel", category: "Analytics", pattern: /cdn\.mxpnl\.com|mixpanel\.init/i },
  { name: "Plausible", category: "Analytics (privacy-friendly)", pattern: /plausible\.io\/js/i },
  { name: "Matomo", category: "Analytics (privacy-friendly)", pattern: /matomo\.js|_paq\.push/i },
  { name: "Cloudflare Insights", category: "Analytics (privacy-friendly)", pattern: /static\.cloudflareinsights\.com/i },
  { name: "YouTube embed", category: "Embedded content", pattern: /youtube\.com\/embed|youtube-nocookie/i },
  { name: "Google Fonts", category: "Embedded content", pattern: /fonts\.googleapis\.com/i },
  { name: "Cookiebot", category: "Consent management", pattern: /consent\.cookiebot\.com/i },
  { name: "OneTrust", category: "Consent management", pattern: /cdn\.cookielaw\.org|onetrust/i },
  { name: "CookieYes", category: "Consent management", pattern: /cdn-cookieyes\.com/i },
];

const BLOCKED_HOSTS = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|\[::1\])/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    let target: URL;
    try {
      target = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    } catch {
      return json({ error: "Invalid URL" }, 400);
    }
    if (!/^https?:$/.test(target.protocol) || BLOCKED_HOSTS.test(target.hostname)) {
      return json({ error: "URL not allowed" }, 400);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(target.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SecurepathScanner/1.0; +https://securepathconsulting.co.za/tools/cookie-scanner)" },
    });
    clearTimeout(timer);

    const html = (await res.text()).slice(0, 2_000_000);
    const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];

    const found = SIGNATURES
      .filter((s) => s.pattern.test(html))
      .map(({ name, category }) => ({ name, category }));

    const hasConsentTool = found.some((f) => f.category === "Consent management");

    return json({
      url: target.href,
      finalUrl: res.url,
      https: new URL(res.url).protocol === "https:",
      status: res.status,
      trackers: found,
      serverCookies: setCookies.length,
      hasConsentTool,
    });
  } catch (e) {
    const msg = e instanceof Error && e.name === "AbortError" ? "Site took too long to respond" : "Could not fetch site";
    return json({ error: msg }, 502);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
