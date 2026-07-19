import { useState } from 'react';
import ToolShell from '../../components/ToolShell';

// Decision tree: each node = question with options pointing to next node or result.
const TREE = {
  start: {
    q: 'Which law applies to the affected data?',
    options: [
      { label: 'POPIA (South Africa)', next: 'popia_access' },
      { label: 'GDPR (EU) / UK GDPR', next: 'gdpr_breach' },
      { label: 'Both', next: 'popia_access', note: 'Answer for POPIA first, then rerun for GDPR — obligations are cumulative.' },
    ],
  },
  popia_access: {
    q: 'Are there reasonable grounds to believe personal information was accessed or acquired by an unauthorised person?',
    options: [
      { label: 'Yes', next: 'popia_notify' },
      { label: 'No — data stayed encrypted / no access occurred', result: 'popia_no' },
      { label: 'Unsure', result: 'popia_investigate' },
    ],
  },
  popia_notify: {
    q: 'Can the identity of affected data subjects be established?',
    options: [
      { label: 'Yes', result: 'popia_full' },
      { label: 'No', result: 'popia_regulator_only' },
    ],
  },
  gdpr_breach: {
    q: 'Is the breach likely to result in a risk to the rights and freedoms of individuals?',
    options: [
      { label: 'Yes', next: 'gdpr_high' },
      { label: 'No — e.g. securely encrypted data, key not compromised', result: 'gdpr_document_only' },
      { label: 'Unsure', result: 'gdpr_assume_risk' },
    ],
  },
  gdpr_high: {
    q: 'Is the risk to individuals HIGH (identity theft, fraud, discrimination, physical harm)?',
    options: [
      { label: 'Yes', result: 'gdpr_full' },
      { label: 'No', result: 'gdpr_regulator_only' },
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
      intro="Answer a few questions about the incident and find out whether you must notify the Information Regulator, your supervisory authority, or affected individuals — and how fast."
    >
      <div className="space-y-8">
        {trail.length > 0 && (
          <div className="space-y-2">
            {trail.map((t, i) => (
              <p key={i} className="text-xs font-mono text-primary/40">
                {t.q} → <span className="text-accent">{t.a}</span>
              </p>
            ))}
          </div>
        )}

        {!r ? (
          <div>
            <p className="text-xl font-bold mb-6">{TREE[node].q}</p>
            <div className="space-y-2">
              {TREE[node].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answer(opt)}
                  className="block w-full text-left p-5 rounded-lg border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-colors text-sm"
                >
                  {opt.label}
                  {opt.note && <span className="block text-xs text-primary/40 mt-1">{opt.note}</span>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-lg border ${r.urgent ? 'border-red-500/30 bg-red-500/5' : 'border-accent/20 bg-[#0B0E14]'}`}>
            <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 ${r.urgent ? 'text-red-400' : 'text-accent/60'}`}>
              {r.urgent ? '⚠ Action required' : 'Outcome'}
            </p>
            <h2 className="text-2xl font-bold mb-4">{r.title}</h2>
            <p className="text-primary/70 text-sm leading-relaxed mb-6">{r.body}</p>
            <button onClick={reset} className="border border-white/20 text-primary/60 px-6 py-3 rounded-full text-sm">
              Start over
            </button>
          </div>
        )}

        <p className="text-primary/40 text-xs leading-relaxed">
          General guidance based on POPIA section 22 and GDPR articles 33–34, not legal advice.
          Sector rules (banking, health, telecoms) may add notification duties on top of these.
        </p>
      </div>
    </ToolShell>
  );
};

export default BreachChecker;
