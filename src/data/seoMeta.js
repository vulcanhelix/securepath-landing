// Shared SEO metadata — imported by App.jsx (runtime) and scripts/prerender.js (build).
export const SITE_URL = 'https://securepathconsulting.co.za';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export const defaultMeta = {
  title: 'Securepath Consulting | Cybersecurity and Data Protection',
  description:
    'Securepath Consulting helps organisations in South Africa and beyond strengthen cybersecurity, POPIA, GDPR, privacy, and third-party risk programmes.',
};

export const routeMeta = {
  '/': defaultMeta,
  '/about': {
    title: 'About Securepath Consulting | Boutique Cybersecurity Expertise',
    description:
      'Learn how Securepath Consulting combines cybersecurity strategy, privacy compliance, and bespoke professional services for resilient digital operations.',
  },
  '/solutions': {
    title: 'Cybersecurity and Privacy Solutions | Securepath Consulting',
    description:
      'Explore Securepath Consulting services for privacy assessments, third-party risk, security posture, framework engineering, and Microsoft 365 audits.',
  },
  '/methodology': {
    title: 'Client-Centric Cybersecurity Methodology | Securepath Consulting',
    description:
      "See Securepath Consulting's discovery, implementation, and continuous optimisation methodology for practical cybersecurity and data protection programmes.",
  },
  '/insights': {
    title: 'Cybersecurity and Privacy Insights | Securepath Consulting',
    description:
      'Read Securepath Consulting insights on POPIA, GDPR, cybersecurity, data governance, privacy, compliance, and regulatory readiness.',
  },
  '/contact': {
    title: 'Contact Securepath Consulting | Start a Security Audit',
    description:
      'Contact Securepath Consulting to discuss cybersecurity, POPIA, GDPR, third-party risk, privacy, and Microsoft 365 security requirements.',
  },
  '/deck': {
    title: 'Securepath Consulting Presentation Deck',
    description: 'Internal Securepath Consulting presentation deck.',
    robots: 'noindex,nofollow',
  },
};

export const serviceMeta = {
  'cybersecurity-services': {
    title: 'Cybersecurity and Data Protection Services | Securepath Consulting',
    description:
      'Secure critical assets with cybersecurity assessments, secure architecture, incident response planning, and data protection strategy.',
  },
  'dsar-management': {
    title: 'Managed DSAR Service | Securepath Consulting',
    description:
      'Outsource data subject access request handling across South Africa, the United Kingdom, and Mauritius with compliant workflows and clear documentation.',
  },
  'information-officer': {
    title: 'Information Officer as a Service | Securepath Consulting',
    description:
      'Get outsourced POPIA Information Officer leadership, regulator liaison, privacy governance, policy management, and compliance monitoring.',
  },
  'microsoft-365-audit': {
    title: 'Microsoft 365 Security Audit | Securepath Consulting',
    description:
      'Identify Microsoft 365 misconfigurations, access risks, phishing exposure, audit trail gaps, and hardening priorities.',
  },
  'privacy-audit': {
    title: 'Comprehensive Privacy Audit | Securepath Consulting',
    description:
      'Assess POPIA, GDPR, data mapping, privacy notices, vendor controls, and operational data protection practices with a practical remediation roadmap.',
  },
  'security-posture-assessment': {
    title: 'Security Posture Assessment | Securepath Consulting',
    description:
      'Evaluate security controls, vulnerability exposure, incident readiness, and regulatory alignment against modern threat vectors.',
  },
  'third-party-risk': {
    title: 'Third-Party Risk Management | Securepath Consulting',
    description:
      'Map vendors, assess third-party cyber and privacy controls, and improve supply-chain security governance.',
  },
  'customized-privacy-program': {
    title: 'Customized Privacy Program | Securepath Consulting',
    description:
      'Build a scalable privacy programme with data flow mapping, DPIAs, policy development, training, and measurable implementation priorities.',
  },
};

export const getRouteMeta = (pathname) => {
  if (pathname.startsWith('/services/')) {
    const slug = pathname.split('/services/')[1];
    return serviceMeta[slug] || routeMeta['/solutions'];
  }

  if (pathname.startsWith('/insights/')) {
    return {
      title: 'Cybersecurity and Privacy Insight | Securepath Consulting',
      description:
        'Securepath Consulting insight on practical privacy, compliance, cybersecurity, and data governance readiness.',
    };
  }

  return (
    routeMeta[pathname] || {
      title: 'Page Not Found | Securepath Consulting',
      description: 'The requested Securepath Consulting page could not be found.',
      robots: 'noindex,follow',
    }
  );
};
