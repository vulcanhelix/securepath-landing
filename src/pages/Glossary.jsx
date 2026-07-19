import { useParams, Link } from 'react-router-dom';
import { glossaryTerms, getGlossaryTerm } from '../data/glossary';

// Handles /glossary (index) and /glossary/:term (detail).
const Glossary = () => {
  const { term: slug } = useParams();
  const entry = slug ? getGlossaryTerm(slug) : null;

  if (slug && !entry) {
    return (
      <div className="min-h-screen bg-background text-primary pt-40 pb-24 text-center">
        <p className="text-primary/40 font-mono text-sm mb-6">Term not found.</p>
        <Link to="/glossary" className="text-accent hover:underline">Browse the glossary</Link>
      </div>
    );
  }

  if (!entry) {
    const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
    return (
      <div className="min-h-screen bg-background text-primary pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-accent/60 mb-4">Reference</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            Privacy <span className="text-accent font-drama italic font-normal normal-case">Glossary.</span>
          </h1>
          <p className="text-primary/60 text-lg leading-relaxed max-w-2xl mb-16">
            Plain-English definitions of the POPIA, GDPR, and cybersecurity terms you will meet in
            contracts, audits, and regulator correspondence.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {sorted.map((t) => (
              <Link key={t.slug} to={`/glossary/${t.slug}`} className="group p-5 bg-[#0B0E14] border border-white/5 hover:border-accent/30 rounded-lg transition-colors">
                <span className="font-bold group-hover:text-accent transition-colors">{t.term}</span>
                <p className="text-primary/40 text-sm mt-1 line-clamp-2">{t.definition}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const related = (entry.related || []).map(getGlossaryTerm).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-primary pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/glossary" className="text-xs font-mono text-primary/40 hover:text-accent transition-colors uppercase tracking-widest">
          Glossary
        </Link>
        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[0.95] mb-8">
          {entry.term}
        </h1>
        <p className="text-lg text-primary/80 leading-relaxed mb-12">{entry.definition}</p>

        {related.length > 0 && (
          <div className="border-t border-white/5 pt-8 mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/40 mb-4">Related terms</p>
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/glossary/${r.slug}`} className="text-sm text-accent hover:underline">{r.term}</Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/5 pt-8 mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/40 mb-4">Put it into practice</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/tools" className="text-sm text-accent hover:underline">Free compliance tools</Link>
            <Link to="/compare/popia-vs-gdpr" className="text-sm text-accent hover:underline">POPIA vs GDPR</Link>
            <Link to="/insights" className="text-sm text-accent hover:underline">Insights</Link>
          </div>
        </div>

        <div className="p-8 bg-[#0B0E14] border border-accent/10 rounded-lg">
          <p className="text-primary/60 text-sm leading-relaxed mb-5">
            Wrestling with what this means for your organisation in practice? Securepath Consulting
            turns definitions into working compliance programmes.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
