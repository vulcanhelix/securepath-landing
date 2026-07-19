// Registry of free tools — drives /tools hub, routes, SEO meta, prerender, sitemap.
export const toolsData = [
  {
    slug: 'popia-fine-calculator',
    name: 'POPIA Fine Calculator',
    tagline: 'Estimate your penalty exposure',
    description:
      'Estimate potential POPIA fines and penalty exposure for your South African business based on turnover, breach type, and records affected.',
    seoTitle: 'POPIA Fine Calculator | Estimate Your Penalty Exposure',
  },
  {
    slug: 'privacy-policy-generator',
    name: 'POPIA Privacy Policy Generator',
    tagline: 'Generate a compliant policy in minutes',
    description:
      'Free POPIA-aligned privacy policy generator for South African businesses. Answer a few questions, get a tailored privacy policy you can publish today.',
    seoTitle: 'Free POPIA Privacy Policy Generator for South African Businesses',
  },
  {
    slug: 'dsar-deadline-calculator',
    name: 'DSAR Deadline Calculator',
    tagline: 'Never miss a response deadline',
    description:
      'Calculate your data subject access request response deadline under POPIA, GDPR, or UK GDPR, including extension rules and a response checklist.',
    seoTitle: 'DSAR Response Deadline Calculator | POPIA, GDPR and UK GDPR',
  },
  {
    slug: 'breach-notification-checker',
    name: 'Breach Notification Checker',
    tagline: 'Must you report this breach?',
    description:
      'Interactive decision tree: determine whether you must notify the Information Regulator, the ICO, or data subjects after a personal data breach.',
    seoTitle: 'Data Breach Notification Checker | POPIA Section 22 and GDPR',
  },
  {
    slug: 'vendor-risk-scorecard',
    name: 'Vendor Risk Scorecard',
    tagline: 'Score your suppliers in 5 minutes',
    description:
      'Free third-party risk scorecard. Answer 12 questions about a vendor and get a privacy and security risk rating with recommended next steps.',
    seoTitle: 'Free Vendor Risk Scorecard | Third-Party Privacy and Security Rating',
  },
  {
    slug: 'information-officer-checker',
    name: 'Information Officer Checker',
    tagline: 'Do you need to register an IO?',
    description:
      'Check whether your organisation must register an Information Officer with the Information Regulator, and get a step-by-step registration guide.',
    seoTitle: 'Information Officer Registration Checker and Guide | POPIA',
  },
  {
    slug: 'cookie-scanner',
    name: 'Cookie & Tracker Scanner',
    tagline: 'See what your website really loads',
    description:
      'Scan any website for cookies, analytics, and advertising trackers, and see what that means for POPIA and GDPR consent requirements.',
    seoTitle: 'Free Website Cookie and Tracker Scanner | POPIA and GDPR',
  },
];

export const getToolBySlug = (slug) => toolsData.find((t) => t.slug === slug);
