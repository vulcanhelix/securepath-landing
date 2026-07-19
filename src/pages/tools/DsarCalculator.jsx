import { useState } from 'react';
import ToolShell from '../../components/ToolShell';

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};
const fmt = (d) => d.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const CHECKLIST = [
  'Log the request and acknowledge receipt in writing',
  'Verify the requester\'s identity before disclosing anything',
  'Clarify scope if the request is broad (the clock keeps running under GDPR unless you need identity verification)',
  'Search all systems: email, CRM, HR records, backups within reason',
  'Redact third-party personal information from the response',
  'Check exemptions (legal privilege, ongoing investigations) before withholding',
  'Respond in a clear, accessible format and record what was sent',
];

const DsarCalculator = () => {
  const [jurisdiction, setJurisdiction] = useState('gdpr');
  const [date, setDate] = useState('');
  const [extended, setExtended] = useState(false);

  const d = date ? new Date(date) : null;
  let deadline = null;
  let extDeadline = null;
  let note = '';

  if (d) {
    if (jurisdiction === 'popia') {
      deadline = addDays(d, 30);
      note =
        'POPIA (via PAIA section 25) requires a decision on an access request as soon as reasonably possible, and in any event within 30 days. One extension of up to 30 additional days is possible for large or complex requests — the requester must be notified within the initial 30 days.';
      extDeadline = extended ? addDays(d, 60) : null;
    } else {
      deadline = addMonths(d, 1);
      extDeadline = extended ? addMonths(d, 3) : null;
      note =
        jurisdiction === 'gdpr'
          ? 'GDPR article 12(3): respond without undue delay, at the latest within one month of receipt. Extendable by two further months for complex or numerous requests — you must inform the data subject of the extension, with reasons, within the first month.'
          : 'UK GDPR mirrors EU GDPR: one month to respond, extendable by two further months for complex or numerous requests with notice in the first month. The ICO expects the clock to pause only while you await identity verification or clarification.';
    }
  }

  return (
    <ToolShell
      slug="dsar-deadline-calculator"
      intro="Enter the date you received the data subject access request and your jurisdiction. Get your legal response deadline, extension rules, and a response checklist."
    >
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-2">
          {[
            ['popia', 'POPIA (South Africa)'],
            ['gdpr', 'GDPR (EU)'],
            ['ukgdpr', 'UK GDPR'],
          ].map(([id, label]) => (
            <label key={id} className={`p-4 rounded-lg border text-center text-sm cursor-pointer transition-colors ${jurisdiction === id ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
              <input type="radio" name="jur" checked={jurisdiction === id} onChange={() => setJurisdiction(id)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>

        <label className="block max-w-xs">
          <span className="block font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Date request received</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none [color-scheme:dark]"
          />
        </label>

        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input type="checkbox" checked={extended} onChange={() => setExtended(!extended)} className="accent-emerald-500" />
          The request is complex or voluminous (show extended deadline)
        </label>

        {deadline && (
          <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Your response deadline</p>
            <p className="text-3xl md:text-4xl font-black text-accent mb-2">{fmt(deadline)}</p>
            {extDeadline && (
              <p className="text-primary/70 text-sm mb-4">
                With a properly notified extension: <strong className="text-primary">{fmt(extDeadline)}</strong>
              </p>
            )}
            <p className="text-primary/50 text-sm leading-relaxed">{note}</p>
          </div>
        )}

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-4">Response checklist</p>
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-primary/70">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-accent rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default DsarCalculator;
