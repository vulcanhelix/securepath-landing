// Post-build prerender: writes per-route copies of dist/index.html with correct
// title/description/canonical/OG/Twitter meta and JSON-LD baked into the raw HTML,
// so crawlers that don't execute JS (and Google's first pass) see the right signals.
// ponytail: meta-only shells, not full HTML snapshots — content still renders client-side.
import { createClient } from '@supabase/supabase-js';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, DEFAULT_OG_IMAGE, routeMeta, serviceMeta } from '../src/data/seoMeta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '../dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function renderShell({ path, title, description, robots = 'index,follow', ogType = 'website', image = DEFAULT_OG_IMAGE, jsonld }) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robots}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta name="twitter:card" content=")[^"]*(")/, `$1summary_large_image$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);

  const extra = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : '',
  ].filter(Boolean).join('\n    ');
  html = html.replace('</head>', `    ${extra}\n  </head>`);

  const outDir = path === '/' ? dist : resolve(dist, `.${path}`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html, 'utf-8');
}

async function main() {
  // Static routes
  for (const [path, meta] of Object.entries(routeMeta)) {
    renderShell({ path, ...meta });
  }

  // Service pages
  for (const [slug, meta] of Object.entries(serviceMeta)) {
    renderShell({ path: `/services/${slug}`, ...meta });
  }

  // Insight posts from Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Missing Supabase env vars — skipping insight prerender');
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: posts, error } = await supabase
    .from('insights')
    .select('slug, title, subtitle, excerpt, category, author, published_at, cover_image_url')
    .eq('published', true);
  if (error) {
    console.error('❌ Supabase query failed:', error.message);
    process.exit(1);
  }

  for (const post of posts) {
    const path = `/insights/${post.slug}`;
    const url = `${SITE_URL}${path}`;
    const title = `${post.title} | Securepath Consulting`;
    const description = post.excerpt || post.subtitle || post.title;
    const image = post.cover_image_url || DEFAULT_OG_IMAGE;
    renderShell({
      path,
      title,
      description,
      ogType: 'article',
      image,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description,
        image,
        url,
        datePublished: post.published_at,
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: url,
      },
    });
  }

  console.log(`✅ Prerendered ${Object.keys(routeMeta).length} static + ${Object.keys(serviceMeta).length} service + ${posts.length} insight shells`);
}

main();
