import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

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
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">1</span><h2 className="text-xl md:text-2xl font-bold">Which law applies?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">Go by where the requester is and which market you serve — not where your servers are. Serving both SA and EU/UK customers? The stricter (shorter) deadline wins.</p>
          <div className="grid md:grid-cols-3 gap-2">
            {[
              ['popia', 'POPIA (South Africa)', 'The requester is in South Africa, or your business is SA-based.'],
              ['gdpr', 'GDPR (EU)', 'The requester is in the EU, or you actively serve EU customers.'],
              ['ukgdpr', 'UK GDPR', 'The requester is in the United Kingdom.'],
            ].map(([id, label, hint]) => (
              <label key={id} className={`p-4 rounded-lg border cursor-pointer transition-colors ${jurisdiction === id ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <input type="radio" name="jur" checked={jurisdiction === id} onChange={() => setJurisdiction(id)} className="sr-only" />
                <span className="block text-sm font-semibold text-center">{label}</span>
                <span className="block text-sm text-primary/65 leading-relaxed mt-1.5 text-center">{hint}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">2</span><h2 className="text-xl md:text-2xl font-bold">When did the request arrive?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">The clock starts when the request reaches your organisation — any channel counts: email, social media DM, even a verbal request to a staff member.</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ml-12 max-w-xs w-full bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none [color-scheme:dark]"
          />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">3</span><h2 className="text-xl md:text-2xl font-bold">Is it complex or voluminous?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">Extensions exist for genuinely large or complicated requests — years of records across many systems, or many requests from one person. "We're busy" doesn't qualify, and you must tell the requester about the extension before the original deadline.</p>
          <label className="flex items-center gap-3 text-sm cursor-pointer ml-12">
            <input type="checkbox" checked={extended} onChange={() => setExtended(!extended)} className="accent-emerald-500" />
            Yes — show the extended deadline too
          </label>
        </div>

        {deadline && (
          <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Your response deadline</p>
            <p className="text-3xl md:text-4xl font-black text-accent mb-2">{fmt(deadline)}</p>
            {extDeadline && (
              <p className="text-primary/70 text-sm mb-4">
                With a properly notified extension: <strong className="text-primary">{fmt(extDeadline)}</strong>
              </p>
            )}
            <p className="text-primary/70 text-[15px] leading-relaxed">{note}</p>
          </div>
        )}

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Response checklist</p>
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-primary/80">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-accent rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {deadline && (
          <Gated
            tool="dsar-deadline-calculator"
            context={{ jurisdiction, received: date, extended }}
            heading="Free: the DSAR response letter pack"
            bullets={[
              'What a compliant acknowledgement, extension notice, and final response must contain',
              'How to verify identity without demanding excessive documents (a common complaint trigger)',
              'When you may refuse or charge — and the exact wording to use when you do',
            ]}
            buttonLabel="Show the letter pack"
          >
            <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">DSAR response letter pack</p>
              <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                <div>
                  <p className="font-bold mb-2">Acknowledgement (send within 3 business days)</p>
                  <p className="text-primary/70">Confirm receipt, state the deadline you are working to, name a contact person, and — if needed — request specific identity verification. Ask only for what's proportionate: a copy of an ID for sensitive records, far less for a newsletter unsubscribe history.</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Extension notice (before the original deadline)</p>
                  <p className="text-primary/70">State the new date, the specific reason (volume, complexity, number of requests), and the requester's right to complain to the Regulator or ICO. A vague "we need more time" is itself a violation.</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Final response</p>
                  <p className="text-primary/70">Include: what you hold, where it came from, who it has been shared with, how long you keep it, and their correction/deletion rights. Redact third parties. If refusing anything, cite the exact exemption and explain the complaint route.</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Refusals and fees</p>
                  <p className="text-primary/70">Manifestly unfounded or excessive requests can be refused or charged for under GDPR — but document the reasoning; the burden of proof is yours. Under POPIA/PAIA, prescribed fees may apply to access requests, but only the published amounts.</p>
                </div>
              </div>
              <p className="text-primary/70 text-sm mt-6">
                Handling DSARs regularly? Our <a href="/services/dsar-management" className="text-accent hover:underline">Managed DSAR Service</a> runs
                the whole workflow for you across POPIA, GDPR, and UK GDPR.
              </p>
            </div>
          </Gated>
        )}

        <div className="border-t border-white/5 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
          <ul className="space-y-1.5 text-sm text-primary/60">
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">POPIA</a>{' '}
              s23–25 read with{' '}
              <a href="https://www.gov.za/documents/promotion-access-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">PAIA</a>{' '}
              s25 — 30-day decision period and extension rules
            </li>
            <li>
              <a href="https://gdpr-info.eu/art-12-gdpr/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">GDPR Article 12(3)</a>{' '}
              — one month, extendable by two for complex or numerous requests
            </li>
            <li>
              <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">ICO right-of-access guidance</a>{' '}
              — UK deadlines, clock-stopping, and refusals
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            General guidance, not legal advice. Sector rules and pending litigation can change what you must disclose or withhold.
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default DsarCalculator;
