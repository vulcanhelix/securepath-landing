import { Link } from 'react-router-dom';
import { toolsData } from '../data/toolsData';

// Shared layout for /tools/* pages: hero, content, cross-links, CTA, disclaimer.
const ToolShell = ({ slug, children, intro }) => {
  const tool = toolsData.find((t) => t.slug === slug);
  const others = toolsData.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <Link to="/tools" className="text-xs font-mono text-primary/40 hover:text-accent transition-colors uppercase tracking-widest">
            Free Tools
          </Link>
          <h1 className="mt-4 text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            {tool.name}
          </h1>
          <p className="mt-4 text-xl font-drama italic text-accent/80">{tool.tagline}</p>
          {intro && <p className="mt-6 text-primary/75 text-lg leading-relaxed max-w-2xl">{intro}</p>}
        </div>

        {children}

        <div className="mt-16 p-8 bg-[#0B0E14] border border-accent/10 rounded-lg">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">Need expert help?</p>
          <p className="text-primary/75 text-[15px] leading-relaxed mb-5">
            This tool gives general guidance, not legal advice. For a tailored assessment of your
            organisation's obligations, talk to Securepath Consulting.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold">
            Get in touch
          </Link>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/40 mb-4">More free tools</p>
          <div className="flex flex-wrap gap-3">
            {others.map((t) => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="text-sm text-accent hover:underline">
                {t.name}
              </Link>
            ))}
            <Link to="/glossary" className="text-sm text-accent hover:underline">Privacy Glossary</Link>
            <Link to="/compare/popia-vs-gdpr" className="text-sm text-accent hover:underline">POPIA vs GDPR</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolShell;
