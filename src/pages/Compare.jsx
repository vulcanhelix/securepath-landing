import { useParams, Link } from 'react-router-dom';
import { compareTopics, getCompareTopic } from '../data/popiaGdprCompare';

// Handles /compare/popia-vs-gdpr (index) and /compare/popia-vs-gdpr/:topic (detail).
const Compare = () => {
  const { topic: slug } = useParams();
  const topic = slug ? getCompareTopic(slug) : null;

  if (slug && !topic) {
    return (
      <div className="min-h-screen bg-background text-primary pt-40 pb-24 text-center">
        <p className="text-primary/40 font-mono text-sm mb-6">Comparison topic not found.</p>
        <Link to="/compare/popia-vs-gdpr" className="text-accent hover:underline">All POPIA vs GDPR topics</Link>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background text-primary pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-accent/60 mb-4">Comparison Guide</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            POPIA <span className="text-accent font-drama italic font-normal normal-case">vs</span> GDPR
          </h1>
          <p className="text-primary/60 text-lg leading-relaxed max-w-2xl mb-16">
            South Africa's POPIA and Europe's GDPR share DNA but differ where it counts. Pick a topic
            for a side-by-side breakdown with practical takeaways.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {compareTopics.map((t) => (
              <Link key={t.slug} to={`/compare/popia-vs-gdpr/${t.slug}`} className="group p-6 bg-[#0B0E14] border border-white/5 hover:border-accent/30 rounded-lg transition-colors">
                <h2 className="text-lg font-bold group-hover:text-accent transition-colors mb-2">{t.name}</h2>
                <p className="text-primary/50 text-sm leading-relaxed">{t.seoDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <Link to="/compare/popia-vs-gdpr" className="text-xs font-mono text-primary/40 hover:text-accent transition-colors uppercase tracking-widest">
            POPIA vs GDPR
          </Link>
          <h1 className="mt-4 text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            {topic.name}
          </h1>
          <p className="mt-6 text-primary/60 leading-relaxed max-w-2xl">{topic.intro}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="text-left">
                <th className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-primary/40 border-b border-white/10 w-1/5">Aspect</th>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-accent border-b border-white/10 w-2/5">POPIA (South Africa)</th>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-primary/70 border-b border-white/10 w-2/5">GDPR (EU)</th>
              </tr>
            </thead>
            <tbody>
              {topic.rows.map((row) => (
                <tr key={row.aspect} className="align-top">
                  <td className="p-4 font-bold border-b border-white/5">{row.aspect}</td>
                  <td className="p-4 text-primary/70 leading-relaxed border-b border-white/5">{row.popia}</td>
                  <td className="p-4 text-primary/70 leading-relaxed border-b border-white/5">{row.gdpr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-3">Practical takeaway</p>
          <p className="text-primary/70 leading-relaxed">{topic.takeaway}</p>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/40 mb-4">Other topics</p>
          <div className="flex flex-wrap gap-3">
            {compareTopics.filter((t) => t.slug !== topic.slug).map((t) => (
              <Link key={t.slug} to={`/compare/popia-vs-gdpr/${t.slug}`} className="text-sm text-accent hover:underline">{t.name}</Link>
            ))}
          </div>
          <p className="text-primary/50 text-sm mt-6">
            Need both regimes handled properly? See our{' '}
            <Link to="/services/privacy-audit" className="text-accent hover:underline">Privacy Audit</Link> and{' '}
            <Link to="/services/customized-privacy-program" className="text-accent hover:underline">Customized Privacy Program</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compare;
