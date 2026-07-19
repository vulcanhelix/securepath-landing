import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

// weight = how much a "no" hurts. Answers: yes=1, partial=0.5, no/unknown=0.
const QUESTIONS = [
  { id: 'dpa', w: 3, text: 'Is there a signed data processing agreement (operator agreement) in place?',
    hint: 'The written contract that makes the vendor legally responsible for protecting your data. POPIA section 21 and GDPR article 28 make it mandatory — without it you are non-compliant even if the vendor is flawless.' },
  { id: 'data', w: 3, text: 'Do you know exactly what personal information the vendor processes for you?',
    hint: 'Customer emails? ID numbers? Payroll? If you cannot list it, you cannot assess the damage a breach there would do to you.' },
  { id: 'subproc', w: 2, text: 'Does the vendor disclose its sub-processors and notify you of changes?',
    hint: 'Vendors use vendors — your CRM might store data on a third-party cloud. You are accountable for that whole chain.' },
  { id: 'location', w: 2, text: 'Do you know where the data is stored, and are cross-border transfer conditions met?',
    hint: 'Most cloud tools store data outside South Africa. POPIA section 72 requires a lawful basis for that — usually a contract clause guaranteeing similar protection.' },
  { id: 'certs', w: 2, text: 'Does the vendor hold recognised certifications (ISO 27001, SOC 2) or provide audit reports?',
    hint: 'Independent proof their security claims are real. No certification is not fatal for a small vendor — but then you need other evidence, like a completed security questionnaire.' },
  { id: 'breach', w: 3, text: 'Is the vendor contractually required to notify you of a breach without undue delay?',
    hint: 'POPIA requires operators to tell you "immediately". Your own notification clock starts when they tell you — a vendor that sits on a breach turns their incident into your violation.' },
  { id: 'access', w: 2, text: 'Is access to your data restricted to vendor staff who need it, with MFA enforced?',
    hint: 'The Dis-Chem incident started with a vendor account being brute-forced. MFA and least-privilege access are the cheapest defences that exist.' },
  { id: 'encrypt', w: 2, text: 'Is your data encrypted in transit and at rest?',
    hint: 'Encryption means stolen data is unreadable. It can be the difference between a crisis and a non-event (and under GDPR, between notifying customers or not).' },
  { id: 'retention', w: 1, text: 'Will the vendor delete or return your data on termination?',
    hint: 'Ex-vendors holding your customer data are risk with zero benefit. The contract should force return-and-delete at exit.' },
  { id: 'dsar', w: 1, text: 'Can the vendor support you in answering data subject requests?',
    hint: 'When a customer asks "what do you hold on me?", you have 30 days (POPIA) or one month (GDPR) — including data sitting inside vendor systems.' },
  { id: 'incidents', w: 1, text: 'Has the vendor been free of publicly known breaches in the last 3 years?',
    hint: 'Past breaches are not automatically disqualifying — but how they handled them tells you what your breach would look like.' },
  { id: 'review', w: 1, text: 'Have you reviewed this vendor in the last 12 months?',
    hint: 'Vendor risk drifts: new sub-processors, new features, staff turnover. An annual review is the regulator-expected cadence.' },
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
      intro="Every supplier that touches your data — hosting, payroll, CRM, marketing tools — is risk you own. POPIA holds YOU accountable for what they do with it. Answer 12 questions about one vendor; every question explains why it matters. No prior knowledge needed."
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
              <div className="flex items-start gap-3 mb-1">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/15 border border-accent/50 text-accent flex items-center justify-center font-bold text-sm">{i + 1}</span>
                <p className="text-[15px] font-semibold pt-0.5">{q.text}</p>
              </div>
              <p className="text-sm text-primary/65 leading-relaxed mb-3 ml-10">{q.hint}</p>
              <div className="flex gap-2 ml-10">
                {[['Yes', 1], ['Partially', 0.5], ['No / unknown', 0]].map(([label, v]) => (
                  <button
                    key={label}
                    onClick={() => setA(q.id, v)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${answers[q.id] === v ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-primary/60 hover:border-white/30'}`}
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
          <div className="space-y-6">
            <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg print:border-black">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                Risk rating{vendor ? ` — ${vendor}` : ''}
              </p>
              <p className={`text-5xl font-black mb-1 ${band.color}`}>{pct}/100</p>
              <p className={`text-xl font-bold mb-4 ${band.color}`}>{band.label}</p>
              <p className="text-primary/75 text-[15px] leading-relaxed mb-6">{band.advice}</p>
              {gaps.length > 0 && (
                <>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Gaps, highest impact first</p>
                  <ul className="space-y-2 mb-6">
                    {gaps.map((g) => (
                      <li key={g.id} className="flex items-start gap-3 text-[15px] text-primary/80">
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

            <Gated
              tool="vendor-risk-scorecard"
              context={{ vendor, score: pct, band: band.label, gaps: gaps.map((g) => g.id) }}
              heading="Free: the vendor remediation pack"
              bullets={[
                'The 8 clauses every operator agreement must contain (with the POPIA/GDPR section behind each)',
                'A ready-to-adapt outline for the email that gets vendors to actually fix gaps',
                'When to accept risk, when to escalate, and when to walk away',
              ]}
              buttonLabel="Show the remediation pack"
            >
              <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Vendor remediation pack</p>
                <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                  <div>
                    <p className="font-bold mb-2">The 8 must-have contract clauses</p>
                    <p className="text-primary/70">Confidentiality (POPIA s20); processing only on your instructions (s21/Art 28); security measures matching s19/Art 32; immediate breach notification; sub-processor disclosure and approval; cross-border transfer conditions (s72/Ch V); audit or evidence rights; return-and-delete on exit. If your current agreement is missing three or more, prioritise a re-paper over any technical fix.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">The gap-closure email</p>
                    <p className="text-primary/70">Structure that works: state you are updating vendor compliance under POPIA; list the specific gaps (attach your printed scorecard); give a reasonable deadline (30 days for paperwork, 90 for technical controls); ask for their security documentation in return. Vendors respond to specific asks with deadlines — "please confirm your compliance" gets ignored.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Accept, escalate, or walk</p>
                    <p className="text-primary/70">Accept: low-weight gaps with a documented review date. Escalate: any missing DPA or breach-notification clause on a vendor holding sensitive data — that is your legal exposure, not theirs. Walk: a vendor that refuses contractual security terms is telling you their answer will be the same during an incident.</p>
                  </div>
                </div>
                <p className="text-primary/70 text-sm mt-6">
                  A full supplier base takes more than one scorecard — our <a href="/services/third-party-risk" className="text-accent hover:underline">Third-Party Risk Management</a> service
                  maps, scores, and re-papers your whole vendor estate.
                </p>
              </div>
            </Gated>
          </div>
        )}

        <div className="border-t border-white/5 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
          <ul className="space-y-1.5 text-sm text-primary/60">
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">POPIA</a>{' '}
              — s20–21 (operator obligations and written contracts), s19 (security safeguards), s72 (cross-border transfers)
            </li>
            <li>
              <a href="https://gdpr-info.eu/art-28-gdpr/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">GDPR Article 28</a>{' '}
              — processor contracts and sub-processor rules
            </li>
            <li>
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">Information Regulator</a>{' '}
              — Dis-Chem enforcement notice (2022): the canonical SA case on vendor-caused breaches
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            Weighted self-assessment, not an audit. Scores reflect your answers — verify claims against vendor documentation for anything sensitive.
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default VendorScorecard;
