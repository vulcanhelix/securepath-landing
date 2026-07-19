import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toolsData } from '../data/toolsData';

const Tools = () => (
  <div className="min-h-screen bg-background text-primary pt-32 pb-24">
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-16 max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-accent/60 mb-4">Free Tools</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
          Privacy &amp; Compliance <span className="text-accent font-drama italic font-normal normal-case">Toolkit.</span>
        </h1>
        <p className="text-primary/60 text-lg leading-relaxed">
          Free, no-signup tools for POPIA and GDPR compliance — built by Securepath Consulting.
          Estimate fines, generate policies, check deadlines, and score your vendors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {toolsData.map((tool) => (
          <Link
            key={tool.slug}
            to={`/tools/${tool.slug}`}
            className="group p-8 bg-[#0B0E14] border border-white/5 hover:border-accent/30 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">{tool.name}</h2>
            <p className="text-accent/70 font-drama italic mb-3">{tool.tagline}</p>
            <p className="text-primary/50 text-sm leading-relaxed mb-4">{tool.description}</p>
            <span className="inline-flex items-center gap-2 text-sm text-accent">
              Open tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/compare/popia-vs-gdpr" className="group p-8 bg-[#0B0E14] border border-white/5 hover:border-accent/30 rounded-lg transition-colors">
          <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">POPIA vs GDPR Comparison</h2>
          <p className="text-primary/50 text-sm leading-relaxed">
            Side-by-side breakdowns of consent, rights, breach notification, transfers, penalties, and more.
          </p>
        </Link>
        <Link to="/glossary" className="group p-8 bg-[#0B0E14] border border-white/5 hover:border-accent/30 rounded-lg transition-colors">
          <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Privacy Glossary</h2>
          <p className="text-primary/50 text-sm leading-relaxed">
            Plain-English definitions of POPIA, GDPR, and cybersecurity terms.
          </p>
        </Link>
      </div>
    </div>
  </div>
);

export default Tools;
