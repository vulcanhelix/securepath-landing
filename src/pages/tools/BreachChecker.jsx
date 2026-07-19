import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

// Decision tree: each node = question with options pointing to next node or result.
const TREE = {
  start: {
    q: 'Which law applies to the affected data?',
    help: 'Go by whose data was exposed, not where your servers are. South African customers or staff → POPIA. EU or UK individuals → GDPR / UK GDPR.',
    options: [
      { label: 'POPIA (South Africa)', hint: 'The affected people are in South Africa, or your organisation is SA-based.', next: 'popia_access' },
      { label: 'GDPR (EU) / UK GDPR', hint: 'The affected people are in the EU or UK.', next: 'gdpr_breach' },
      { label: 'Both', hint: 'Mixed database — SA plus EU/UK individuals. Obligations stack; you notify under both regimes.', next: 'popia_access', note: 'Answer for POPIA first, then rerun for GDPR — obligations are cumulative.' },
    ],
  },
  popia_access: {
    q: 'Are there reasonable grounds to believe personal information was accessed or acquired by an unauthorised person?',
    help: '"Reasonable grounds" is a low bar — you don\'t need proof, just credible signs: ransomware note, data on a leak site, logs showing an intruder, a laptop or backup gone missing.',
    options: [
      { label: 'Yes', hint: 'Signs point to someone getting in or taking data — even if you\'re not 100% certain what they saw.', next: 'popia_notify' },
      { label: 'No — data stayed encrypted / no access occurred', hint: 'Example: a stolen laptop with full-disk encryption and no sign the password was compromised, or an attack that was blocked before reaching data.', result: 'popia_no' },
      { label: 'Unsure', hint: 'You know something happened but not yet what was touched. Common in the first hours of an incident.', result: 'popia_investigate' },
    ],
  },
  popia_notify: {
    q: 'Can the identity of affected data subjects be established?',
    help: 'In other words: do you know (or can you work out) whose records were exposed? Usually yes — your own database tells you.',
    options: [
      { label: 'Yes', hint: 'You can identify the affected customers, staff, or contacts.', result: 'popia_full' },
      { label: 'No', hint: 'Genuinely unidentifiable — e.g. a stolen device holding unlabelled, mixed data you cannot map to people.', result: 'popia_regulator_only' },
    ],
  },
  gdpr_breach: {
    q: 'Is the breach likely to result in a risk to the rights and freedoms of individuals?',
    help: 'Ask: could this hurt someone — identity theft, fraud, embarrassment, discrimination, physical danger? Exposed emails and ID numbers = yes. Properly encrypted data with safe keys = usually no.',
    options: [
      { label: 'Yes', hint: 'The exposed data could be used against people, or reveals something private about them.', next: 'gdpr_high' },
      { label: 'No — e.g. securely encrypted data, key not compromised', hint: 'The data is unusable to whoever has it, or the incident was contained before exposure.', result: 'gdpr_document_only' },
      { label: 'Unsure', hint: 'Still investigating scope. Under GDPR, uncertainty defaults to notifying — the clock does not wait.', result: 'gdpr_assume_risk' },
    ],
  },
  gdpr_high: {
    q: 'Is the risk to individuals HIGH (identity theft, fraud, discrimination, physical harm)?',
    help: 'High risk = real potential for serious consequences: financial data, passwords, health records, children\'s data, or anything enabling impersonation. Exposed newsletter emails alone usually are not high risk.',
    options: [
      { label: 'Yes', hint: 'Serious harm is realistically on the table for the people affected.', result: 'gdpr_full' },
      { label: 'No', hint: 'A risk exists but limited — e.g. names and business emails without credentials or financial data.', result: 'gdpr_regulator_only' },
    ],
  },
};

const RESULTS = {
  popia_no: {
    title: 'No section 22 notification required — document and monitor',
    body: 'If no unauthorised access or acquisition occurred, section 22 is not triggered. Document your assessment and the evidence (encryption status, access logs) — you carry the burden of showing why you did not notify. Reassess if new facts emerge.',
    urgent: false,
  },
  popia_investigate: {
    title: 'Investigate immediately — the clock is effectively running',
    body: 'POPIA requires notification "as soon as reasonably possible" once reasonable grounds exist. An inconclusive investigation does not pause the duty indefinitely. Preserve logs, engage forensics, and decide quickly; a documented, diligent investigation is your defence for any delay.',
    urgent: true,
  },
  popia_full: {
    title: 'Notify the Information Regulator AND affected data subjects',
    body: 'Section 22 requires notifying the Information Regulator and affected data subjects as soon as reasonably possible. POPIA has NO risk-threshold exemption for individual notification. Notify in writing (the Regulator provides an eServices portal and SCN1 form), describing the breach, possible consequences, measures taken, recommendations to data subjects, and the intruder\'s identity if known. Delay is only justified by the legitimate needs of law enforcement or measures needed to determine the scope of the compromise.',
    urgent: true,
  },
  popia_regulator_only: {
    title: 'Notify the Information Regulator; individual notice when identifiable',
    body: 'Notify the Regulator as soon as reasonably possible. Individual notification applies to data subjects whose identity can be established — if none can be identified, document why. If identities emerge later, notify then.',
    urgent: true,
  },
  gdpr_document_only: {
    title: 'No notification required — but document it',
    body: 'Where the breach is unlikely to result in risk to individuals, article 33 notification is not required. You must still record the breach, its effects, and remedial action in your internal breach register (article 33(5)) — regulators ask for this register in audits.',
    urgent: false,
  },
  gdpr_assume_risk: {
    title: 'Treat as notifiable — 72-hour clock is running',
    body: 'If you cannot rule out risk, the safe course is to notify the supervisory authority within 72 hours of awareness, flagging that investigation is ongoing (phased notification is expressly allowed). Late notification requires documented reasons.',
    urgent: true,
  },
  gdpr_regulator_only: {
    title: 'Notify the supervisory authority within 72 hours',
    body: 'Article 33: notify the competent supervisory authority without undue delay and within 72 hours of becoming aware. Individual notification is not required unless the risk is high — but document the risk assessment supporting that call.',
    urgent: true,
  },
  gdpr_full: {
    title: 'Notify the authority (72h) AND affected individuals without undue delay',
    body: 'High-risk breaches trigger both article 33 (supervisory authority, 72 hours) and article 34 (affected individuals, without undue delay). Individual notice must be in clear language: nature of the breach, DPO contact, likely consequences, and measures taken. Exceptions apply if data was encrypted or you have taken measures eliminating the high risk.',
    urgent: true,
  },
};

const BreachChecker = () => {
  const [node, setNode] = useState('start');
  const [result, setResult] = useState(null);
  const [trail, setTrail] = useState([]);

  const answer = (opt) => {
    setTrail([...trail, { q: TREE[node].q, a: opt.label }]);
    if (opt.result) setResult(opt.result);
    else setNode(opt.next);
  };

  const reset = () => { setNode('start'); setResult(null); setTrail([]); };

  const r = result && RESULTS[result];

  return (
    <ToolShell
      slug="breach-notification-checker"
      intro="Lost a laptop? Hit by ransomware? Emailed the wrong person? This walks you through — in plain English — whether the law requires you to report it, to whom, and how fast. No prior privacy knowledge needed."
    >
      <div className="space-y-8">
        {trail.length > 0 && (
          <div className="space-y-2">
            {trail.map((t, i) => (
              <p key={i} className="text-sm font-mono text-primary/50">
                {t.q} → <span className="text-accent">{t.a}</span>
              </p>
            ))}
          </div>
        )}

        {!r ? (
          <div>
            <p className="text-xl md:text-2xl font-bold mb-2">{TREE[node].q}</p>
            <p className="text-sm text-primary/60 mb-6">{TREE[node].help}</p>
            <div className="space-y-2">
              {TREE[node].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answer(opt)}
                  className="block w-full text-left p-5 rounded-lg border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-colors"
                >
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="block text-sm text-primary/65 leading-relaxed mt-1">{opt.hint}</span>
                  {opt.note && <span className="block text-sm text-accent/70 mt-1">{opt.note}</span>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-8 rounded-lg border ${r.urgent ? 'border-red-500/30 bg-red-500/5' : 'border-accent/20 bg-[#0B0E14]'}`}>
              <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 ${r.urgent ? 'text-red-400' : 'text-accent'}`}>
                {r.urgent ? '⚠ Action required' : 'Outcome'}
              </p>
              <h2 className="text-2xl font-bold mb-4">{r.title}</h2>
              <p className="text-primary/75 text-[15px] leading-relaxed mb-6">{r.body}</p>
              <button onClick={reset} className="border border-white/20 text-primary/60 px-6 py-3 rounded-full text-sm">
                Start over
              </button>
            </div>

            <Gated
              tool="breach-notification-checker"
              context={{ trail, result }}
              heading="Free: the first-72-hours breach response plan"
              bullets={[
                'Hour-by-hour: what to do in the first 24, 48, and 72 hours',
                'Exactly what your Regulator/authority notification must contain (and the wording mistakes that invite investigation)',
                'What to tell affected people — and what saying too much or too little costs you',
              ]}
              buttonLabel="Show the response plan"
            >
              <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">First-72-hours response plan</p>
                <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                  <div>
                    <p className="font-bold mb-2">Hours 0–24: contain and preserve</p>
                    <p className="text-primary/70">Isolate affected systems without wiping them — evidence first, rebuilding later. Reset compromised credentials, revoke suspicious sessions, and start a timestamped incident log (every decision, every time). Brief only the people who need to act; wide internal emails leak.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Hours 24–48: assess scope</p>
                    <p className="text-primary/70">Establish what data, whose, how many, and how sensitive. Pull access logs before they rotate. If you use an external IT provider or the breach started with a vendor, get their incident report in writing — under POPIA, operators must notify you immediately, and their failure is your evidence.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Hours 48–72: notify</p>
                    <p className="text-primary/70">Regulator notification must include: what happened, categories and estimated numbers affected, likely consequences, measures taken and planned, and a contact point. Don't speculate about causes you haven't confirmed, and don't minimise — "no evidence of misuse" reads very differently from "no misuse". Notify affected people in plain language with concrete steps they can take (change passwords, watch statements, fraud alerts).</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">After: close the loop</p>
                    <p className="text-primary/70">File everything in your breach register, run a root-cause review, and fix the control that failed. Regulators judge the response as hard as the breach — a clean, documented response is your best mitigation against fines.</p>
                  </div>
                </div>
                <p className="text-primary/70 text-sm mt-6">
                  In an active incident and want help? Our <a href="/services/cybersecurity-services" className="text-accent hover:underline">Cybersecurity Services</a> cover
                  incident response planning, and a <a href="/services/security-posture-assessment" className="text-accent hover:underline">Security Posture Assessment</a> finds
                  the gaps before the next one.
                </p>
              </div>
            </Gated>
          </div>
        )}

        <div className="border-t border-white/5 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
          <ul className="space-y-1.5 text-sm text-primary/60">
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">POPIA section 22</a>{' '}
              — security compromise notification duties, and the{' '}
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">Information Regulator's</a>{' '}
              eServices portal / SCN1 breach form
            </li>
            <li>
              <a href="https://gdpr-info.eu/art-33-gdpr/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">GDPR Articles 33–34</a>{' '}
              — 72-hour authority notification and high-risk individual notification
            </li>
            <li>
              <a href="https://ico.org.uk/for-organisations/report-a-breach/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">ICO breach reporting</a>{' '}
              — UK reporting thresholds and the online reporting service
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            General guidance based on POPIA section 22 and GDPR articles 33–34, not legal advice.
            Sector rules (banking, health, telecoms) may add notification duties on top of these.
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default BreachChecker;
