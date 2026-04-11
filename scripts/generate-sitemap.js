import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://securepathconsulting.co.za';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Static routes (excluding /deck which is internal)
const staticRoutes = [
  { path: '/',           changefreq: 'monthly', priority: '1.0' },
  { path: '/about',      changefreq: 'monthly', priority: '0.8' },
  { path: '/solutions',  changefreq: 'monthly', priority: '0.9' },
  { path: '/methodology',changefreq: 'monthly', priority: '0.7' },
  { path: '/insights',   changefreq: 'weekly',  priority: '0.8' },
  { path: '/contact',    changefreq: 'yearly',  priority: '0.7' },
];

// Service slugs from src/data/services.js
const serviceSlugs = [
  'cybersecurity-services',
  'dsar-management',
  'information-officer',
  'microsoft-365-audit',
  'privacy-audit',
  'security-posture-assessment',
  'third-party-risk',
  'customized-privacy-program',
];

// Standalone HTML pages
const standalonePages = [
  { path: '/assessments/gdpr-assessment.html',  changefreq: 'yearly', priority: '0.6' },
  { path: '/assessments/popia-assessment.html',  changefreq: 'yearly', priority: '0.6' },
];

function toUrlEntry({ loc, lastmod, changefreq, priority }) {
  let xml = `  <url>\n    <loc>${loc}</loc>\n`;
  if (lastmod)    xml += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) xml += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority)   xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>`;
  return xml;
}

async function generate() {
  console.log('📡 Fetching published insights from Supabase…');

  const { data: insights, error } = await supabase
    .from('insights')
    .select('slug, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase query failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Found ${insights.length} published insight(s)`);

  const entries = [];

  // Static pages
  for (const route of staticRoutes) {
    entries.push(toUrlEntry({
      loc: `${SITE_URL}${route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
    }));
  }

  // Service pages
  for (const slug of serviceSlugs) {
    entries.push(toUrlEntry({
      loc: `${SITE_URL}/services/${slug}`,
      changefreq: 'monthly',
      priority: '0.8',
    }));
  }

  // Assessment pages
  for (const page of standalonePages) {
    entries.push(toUrlEntry({
      loc: `${SITE_URL}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
  }

  // Dynamic insight posts
  for (const post of insights) {
    const lastmod = post.published_at
      ? new Date(post.published_at).toISOString().split('T')[0]
      : undefined;
    entries.push(toUrlEntry({
      loc: `${SITE_URL}/insights/${post.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.6',
    }));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const outPath = resolve(__dirname, '../dist/sitemap.xml');
  writeFileSync(outPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap written to ${outPath} (${entries.length} URLs)`);
}

generate();
