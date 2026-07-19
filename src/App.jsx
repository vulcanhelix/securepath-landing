import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LogoFull } from './components/Logo';
import Home from './pages/Home';
import { SITE_URL, DEFAULT_OG_IMAGE, getRouteMeta } from './data/seoMeta';

const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Methodology = lazy(() => import('./pages/Methodology'));
const Contact = lazy(() => import('./pages/Contact'));
const ServiceOffering = lazy(() => import('./pages/ServiceOffering'));
const Deck = lazy(() => import('./pages/Deck'));
const Insights = lazy(() => import('./pages/Insights'));
const InsightPost = lazy(() => import('./pages/InsightPost'));
const Tools = lazy(() => import('./pages/Tools'));
const FineCalculator = lazy(() => import('./pages/tools/FineCalculator'));
const PolicyGenerator = lazy(() => import('./pages/tools/PolicyGenerator'));
const DsarCalculator = lazy(() => import('./pages/tools/DsarCalculator'));
const BreachChecker = lazy(() => import('./pages/tools/BreachChecker'));
const VendorScorecard = lazy(() => import('./pages/tools/VendorScorecard'));
const IoChecker = lazy(() => import('./pages/tools/IoChecker'));
const CookieScanner = lazy(() => import('./pages/tools/CookieScanner'));
const Compare = lazy(() => import('./pages/Compare'));
const Glossary = lazy(() => import('./pages/Glossary'));

const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};

const ensureLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const SeoManager = () => {
  const { pathname } = useLocation();
  const meta = useMemo(() => getRouteMeta(pathname), [pathname]);

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`}`;
    const robots = meta.robots || 'index,follow';

    document.title = meta.title;
    ensureMeta('meta[name="description"]', { name: 'description', content: meta.description });
    ensureMeta('meta[name="robots"]', { name: 'robots', content: robots });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Securepath Consulting' });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: meta.description });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: meta.image || DEFAULT_OG_IMAGE });
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: meta.image || DEFAULT_OG_IMAGE });
    ensureLink('canonical', canonicalUrl);

    let script = document.head.querySelector('#securepath-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'securepath-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const graph = [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Securepath Consulting',
        url: SITE_URL,
        email: 'william.d@securepathconsulting.co.za',
        slogan: 'Elevate Protect Succeed',
        areaServed: ['South Africa', 'United Kingdom', 'Mauritius', 'European Union'],
        serviceType: ['Cybersecurity consulting', 'Data protection consulting', 'Privacy compliance'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Securepath Consulting',
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ];

    if (pathname.startsWith('/services/')) {
      graph.push({
        '@type': 'Service',
        name: meta.title.replace(' | Securepath Consulting', ''),
        description: meta.description,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: ['South Africa', 'United Kingdom', 'Mauritius', 'European Union'],
        url: canonicalUrl,
      });
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }, [meta, pathname]);

  return null;
};

// ===== NAVBAR ===== //
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 50;
      setIsScrolled((current) => (current === next ? current : next));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full border text-primary transition-[top,background-color,border-color,backdrop-filter] duration-300 w-[90%] max-w-5xl ${
        isScrolled
          ? 'top-4 border-primary/10 bg-background/80 backdrop-blur-2xl'
          : 'top-8 border-transparent bg-transparent'
      }`}
    >
      <Link to="/" className="flex items-center gap-3">
        <LogoFull className="h-8" />
      </Link>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link to="/about" className="nav-link text-primary/80 hover:text-accent">About</Link>
        <Link to="/solutions" className="nav-link text-primary/80 hover:text-accent">Solutions</Link>
        <Link to="/methodology" className="nav-link text-primary/80 hover:text-accent">Methodology</Link>
        <Link to="/insights" className="nav-link text-primary/80 hover:text-accent">Insights</Link>
        <Link to="/tools" className="nav-link text-primary/80 hover:text-accent">Tools</Link>
        <a href="/assessments/gdpr-assessment.html" className="nav-link text-primary/80 hover:text-accent">GDPR Assessment</a>
        <a href="/assessments/popia-assessment.html" className="nav-link text-primary/80 hover:text-accent">POPIA Assessment</a>
      </div>
      <Link to="/contact" className="magnetic-btn bg-accent text-background px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
        <span>Contact</span>
      </Link>
    </nav>
  );
};

// ===== FOOTER ===== //
const Footer = () => {
  return (
    <footer className="bg-[#0B0E14] text-primary rounded-t-[4rem] px-8 py-16 md:py-24 mt-20 relative border-t border-accent/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
        <div className="md:col-span-2">
          <div className="mb-8">
             <LogoFull className="h-12 opacity-80" />
          </div>
          <p className="text-primary/60 max-w-sm mb-8 text-sm leading-relaxed font-mono">
            Elevate • Protect • Succeed <br />
            Boutique expertise, bespoke solutions tailored to modern threats.
          </p>
          <div className="flex items-center gap-3 text-xs font-mono bg-dark/40 w-max px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
            System Operational
          </div>
        </div>
        
        <nav aria-label="Footer navigation">
          <h2 className="font-bold mb-6 text-accent text-base">Navigation</h2>
          <ul className="space-y-4 text-sm text-primary/70 font-mono">
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/solutions" className="hover:text-accent transition-colors">Solutions</Link></li>
            <li><Link to="/methodology" className="hover:text-accent transition-colors">Methodology</Link></li>
            <li><Link to="/insights" className="hover:text-accent transition-colors">Insights</Link></li>
            <li><Link to="/tools" className="hover:text-accent transition-colors">Free Tools</Link></li>
            <li><a href="/assessments/gdpr-assessment.html" className="hover:text-accent transition-colors">GDPR Assessment</a></li>
            <li><a href="/assessments/popia-assessment.html" className="hover:text-accent transition-colors">POPIA Assessment</a></li>
          </ul>
        </nav>
        
        <div>
          <h2 className="font-bold mb-6 text-accent text-base">Contact</h2>
          <ul className="space-y-4 text-sm text-primary/70 font-mono">
            <li><a href="mailto:william.d@securepathconsulting.co.za" className="hover:text-white transition-colors">william.d@securepathconsulting.co.za</a></li>
            <li><a href="https://www.securepathconsulting.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.securepathconsulting.co.za</a></li>
          </ul>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-t-[4rem] z-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-accent/10 blur-[100px] rounded-full"></div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const RouteFallback = () => (
  <div className="min-h-screen bg-background text-primary flex items-center justify-center px-6">
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/40">Loading Securepath</p>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/services/:slug" element={<ServiceOffering />} />
      <Route path="/methodology" element={<Methodology />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:slug" element={<InsightPost />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/popia-fine-calculator" element={<FineCalculator />} />
      <Route path="/tools/privacy-policy-generator" element={<PolicyGenerator />} />
      <Route path="/tools/dsar-deadline-calculator" element={<DsarCalculator />} />
      <Route path="/tools/breach-notification-checker" element={<BreachChecker />} />
      <Route path="/tools/vendor-risk-scorecard" element={<VendorScorecard />} />
      <Route path="/tools/information-officer-checker" element={<IoChecker />} />
      <Route path="/tools/cookie-scanner" element={<CookieScanner />} />
      <Route path="/compare/popia-vs-gdpr" element={<Compare />} />
      <Route path="/compare/popia-vs-gdpr/:topic" element={<Compare />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/glossary/:term" element={<Glossary />} />
    </Routes>
  </Suspense>
);

// ===== LAYOUT WRAPPER ===== //
const AppLayout = () => {
  const { pathname } = useLocation();
  const isDeck = pathname === '/deck';

  if (isDeck) {
    return (
      <main className="w-full h-screen bg-black overflow-hidden m-0 p-0">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/deck" element={<Deck />} />
          </Routes>
        </Suspense>
      </main>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="flex-grow" tabIndex="-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

// ===== APP WRAPPER ===== //
function App() {
  return (
    <BrowserRouter>
      <SeoManager />
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
