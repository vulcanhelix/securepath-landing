import { useState } from 'react';
import ToolShell from '../../components/ToolShell';

// weight = how much a "no" hurts. Answers: yes=1, partial=0.5, no/unknown=0.
const QUESTIONS = [
  { id: 'dpa', w: 3, text: 'Is there a signed data processing agreement (operator agreement) in place?' },
  { id: 'data', w: 3, text: 'Do you know exactly what personal information the vendor processes for you?' },
  { id: 'subproc', w: 2, text: 'Does the vendor disclose its sub-processors and notify you of changes?' },
  { id: 'location', w: 2, text: 'Do you know where the data is stored, and are cross-border transfer conditions met?' },
  { id: 'certs', w: 2, text: 'Does the vendor hold recognised certifications (ISO 27001, SOC 2) or provide audit reports?' },
  { id: 'breach', w: 3, text: 'Is the vendor contractually required to notify you of a breach without undue delay?' },
  { id: 'access', w: 2, text: 'Is access to your data restricted to vendor staff who need it, with MFA enforced?' },
  { id: 'encrypt', w: 2, text: 'Is your data encrypted in transit and at rest?' },
  { id: 'retention', w: 1, text: 'Will the vendor delete or return your data on termination?' },
  { id: 'dsar', w: 1, text: 'Can the vendor support you in answering data subject requests?' },
  { id: 'incidents', w: 1, text: 'Has the vendor been free of publicly known breaches in the last 3 years?' },
  { id: 'review', w: 1, text: 'Have you reviewed this vendor in the last 12 months?' },
];

const MAX = QUESTIONS.reduce((s, q) => s + q.w, 0);

const bands = (pct) => {
  if (pct >= 80) return { label: 'Low risk', color: 'text-accent', advice: 'Solid posture. Keep the annual review cadence and monitor sub-processor changes.' };
  if (pct >= 60) return { label: 'Moderate risk', color: 'text-yellow-400', advice: 'Workable, but close the gaps — prioritise contract terms (DPA, breach notification) over technical items.' };
  if (pct >= 40) return { label: 'Elevated risk', color: 'text-orange-400', advice: 'This vendor could put you in breach of POPIA section 21 / GDPR article 28. Remediate before renewing or expanding the engagement.' };
  return { label: 'High risk', color: 'text-red-400', advice: 'Serious exposure. Without a DPA and breach-notification terms you are non-compliant by default. Escalate now and consider alternatives.' };
};

const VendorScorecard = () => {
  const [vendor, setVendor] = useState('');
  const [answers, setAnswers] = useState({});
  const [show, setShow] = useState(false);

  const setA = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));
  const complete = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const score = QUESTIONS.reduce((s, q) => s + q.w * (answers[q.id] ?? 0), 0);
  const pct = Math.round((score / MAX) * 100);
  const band = bands(pct);
  const gaps = QUESTIONS.filter((q) => (answers[q.id] ?? 0) < 1).sort((a, b) => b.w - a.w);

  return (
    <ToolShell
      slug="vendor-risk-scorecard"
      intro="Answer 12 questions about a supplier that handles your data. Get a weighted risk rating and a prioritised gap list. Print the result for your vendor file."
    >
      <div className="space-y-8">
        <label className="block max-w-md">
          <span className="block font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Vendor name</span>
          <input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="e.g. CloudCRM (Pty) Ltd"
            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none"
          />
        </label>

        <div className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="p-5 rounded-lg border border-white/10">
              <p className="text-sm mb-3"><span className="text-primary/40 font-mono mr-2">{i + 1}.</span>{q.text}</p>
              <div className="flex gap-2">
                {[['Yes', 1], ['Partially', 0.5], ['No / unknown', 0]].map(([label, v]) => (
                  <button
                    key={label}
                    onClick={() => setA(q.id, v)}
                    className={`px-4 py-2 rounded-full text-xs border transition-colors ${answers[q.id] === v ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-primary/50 hover:border-white/30'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShow(true)}
          disabled={!complete}
          className="bg-accent text-background px-8 py-4 rounded-full font-semibold disabled:opacity-40 hover:scale-105 transition-transform"
        >
          Score this vendor
        </button>

        {show && complete && (
          <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg print:border-black">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
              Risk rating{vendor ? ` — ${vendor}` : ''}
            </p>
            <p className={`text-5xl font-black mb-1 ${band.color}`}>{pct}/100</p>
            <p className={`text-xl font-bold mb-4 ${band.color}`}>{band.label}</p>
            <p className="text-primary/70 text-sm leading-relaxed mb-6">{band.advice}</p>
            {gaps.length > 0 && (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Gaps, highest impact first</p>
                <ul className="space-y-2 mb-6">
                  {gaps.map((g) => (
                    <li key={g.id} className="flex items-start gap-3 text-sm text-primary/70">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {g.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button onClick={() => window.print()} className="border border-accent/40 text-accent px-6 py-3 rounded-full text-sm font-semibold print:hidden">
              Print / save as PDF
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default VendorScorecard;
