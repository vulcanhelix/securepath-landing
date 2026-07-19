import { useState } from 'react';
import ToolShell from '../../components/ToolShell';

const BREACH_TYPES = [
  { id: 'general', label: 'General non-compliance (lawful processing conditions)', weight: 0.4 },
  { id: 'marketing', label: 'Unlawful direct marketing (s69)', weight: 0.45 },
  { id: 'security', label: 'Security compromise / data breach (s19, s22)', weight: 0.6 },
  { id: 'special', label: 'Special personal information or children\'s data', weight: 0.8 },
  { id: 'accounts', label: 'Account numbers involved (s105-106 — criminal offence)', weight: 1.0 },
];

const RECORD_BANDS = [
  { id: 'lt100', label: 'Fewer than 100', factor: 0.5 },
  { id: 'lt10k', label: '100 – 10,000', factor: 0.7 },
  { id: 'lt100k', label: '10,000 – 100,000', factor: 0.85 },
  { id: 'gt100k', label: 'More than 100,000', factor: 1.0 },
];

const AGGRAVATING = [
  { id: 'prior', label: 'Previous complaints or Regulator contact' },
  { id: 'delay', label: 'Delayed or no breach notification' },
  { id: 'nofw', label: 'No compliance framework / Information Officer not registered' },
  { id: 'ignored', label: 'Ignored data subject objections or requests' },
];

const MAX_FINE = 10_000_000; // POPIA s109 administrative fine ceiling

const fmt = (n) => `R${Math.round(n).toLocaleString('en-ZA')}`;

const FineCalculator = () => {
  const [breach, setBreach] = useState('general');
  const [records, setRecords] = useState('lt100');
  const [aggs, setAggs] = useState([]);
  const [show, setShow] = useState(false);

  const breachW = BREACH_TYPES.find((b) => b.id === breach).weight;
  const recordF = RECORD_BANDS.find((r) => r.id === records).factor;
  const aggBoost = 1 + aggs.length * 0.15;

  // ponytail: transparent heuristic, not a legal model — bands the s109 ceiling by severity
  const midpoint = Math.min(MAX_FINE, MAX_FINE * breachW * recordF * aggBoost);
  const low = midpoint * 0.3;
  const high = Math.min(MAX_FINE, midpoint * 1.5);
  const criminal = breach === 'accounts';

  const toggleAgg = (id) =>
    setAggs((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <ToolShell
      slug="popia-fine-calculator"
      intro="POPIA allows administrative fines of up to R10 million per infringement, and certain offences carry criminal liability. Answer three questions to estimate your exposure band."
    >
      <div className="space-y-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-4">1. Nature of the infringement</p>
          <div className="space-y-2">
            {BREACH_TYPES.map((b) => (
              <label key={b.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${breach === b.id ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <input type="radio" name="breach" checked={breach === b.id} onChange={() => setBreach(b.id)} className="accent-emerald-500" />
                <span className="text-sm">{b.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-4">2. Data subjects affected</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {RECORD_BANDS.map((r) => (
              <label key={r.id} className={`p-4 rounded-lg border text-center text-sm cursor-pointer transition-colors ${records === r.id ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <input type="radio" name="records" checked={records === r.id} onChange={() => setRecords(r.id)} className="sr-only" />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-4">3. Aggravating factors</p>
          <div className="space-y-2">
            {AGGRAVATING.map((a) => (
              <label key={a.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${aggs.includes(a.id) ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <input type="checkbox" checked={aggs.includes(a.id)} onChange={() => toggleAgg(a.id)} className="accent-emerald-500" />
                <span className="text-sm">{a.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShow(true)}
          className="bg-accent text-background px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Estimate my exposure
        </button>

        {show && (
          <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Estimated administrative fine exposure</p>
            <p className="text-4xl md:text-5xl font-black text-accent mb-4">
              {fmt(low)} – {fmt(high)}
            </p>
            <p className="text-primary/60 text-sm leading-relaxed mb-4">
              POPIA section 109 caps administrative fines at R10 million per infringement. The Regulator
              considers the seriousness and duration of the infringement, the number of data subjects
              affected, whether it was deliberate or negligent, and any steps taken to mitigate harm.
            </p>
            {criminal && (
              <p className="text-sm text-red-400 leading-relaxed mb-4">
                ⚠ Breaches involving account numbers can constitute a criminal offence under sections
                105–106, carrying fines and/or imprisonment of up to 10 years — separate from any
                administrative fine.
              </p>
            )}
            <p className="text-primary/40 text-xs leading-relaxed">
              This is a directional estimate based on published enforcement factors, not a prediction of
              any actual penalty. Civil claims under section 99 (strict liability, including for distress)
              can add materially to total exposure.
            </p>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default FineCalculator;
