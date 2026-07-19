import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

const BREACH_TYPES = [
  {
    id: 'general',
    label: 'General non-compliance',
    hint: 'You collect or use people\'s information without following POPIA\'s basic rules — no privacy policy, no lawful reason for collecting data, keeping it longer than needed, or using it for things people never agreed to.',
    weight: 0.4,
  },
  {
    id: 'marketing',
    label: 'Unlawful direct marketing',
    hint: 'Emailing, SMSing, or calling people to sell to them without permission. POPIA only allows electronic marketing to existing customers or people who opted in — and you may only ask them once.',
    weight: 0.45,
  },
  {
    id: 'security',
    label: 'Data breach / security compromise',
    hint: 'Someone got into personal information they shouldn\'t have — a hack, a lost laptop, an email sent to the wrong person. POPIA requires "appropriate, reasonable" security; a breach suggests it was missing.',
    weight: 0.6,
  },
  {
    id: 'special',
    label: 'Special or children\'s information involved',
    hint: 'The data includes health records, race, religion, biometrics (fingerprints, face scans), or anything about children under 18. The law protects these most strictly, so penalties scale up.',
    weight: 0.8,
  },
  {
    id: 'accounts',
    label: 'Bank account or card numbers involved',
    hint: 'Financial account numbers are singled out in POPIA — mishandling them is not just a fine, it can be a criminal offence with imprisonment of up to 10 years.',
    weight: 1.0,
  },
];

const RECORD_BANDS = [
  { id: 'lt100', label: 'Fewer than 100', hint: 'A small incident — a misdirected email, one spreadsheet.', factor: 0.5 },
  { id: 'lt10k', label: '100 – 10,000', hint: 'A typical SME customer database.', factor: 0.7 },
  { id: 'lt100k', label: '10,000 – 100,000', hint: 'A large customer or marketing database.', factor: 0.85 },
  { id: 'gt100k', label: 'More than 100,000', hint: 'Mass exposure — the Regulator\'s highest-priority tier.', factor: 1.0 },
];

const AGGRAVATING = [
  {
    id: 'prior',
    label: 'Previous complaints or Regulator contact',
    hint: 'If the Regulator has warned you before, a repeat looks deliberate — and s109 explicitly counts prior conduct against you.',
  },
  {
    id: 'delay',
    label: 'Delayed or no breach notification',
    hint: 'POPIA requires reporting breaches "as soon as reasonably possible". Sitting on one is a separate violation on top of the breach itself.',
  },
  {
    id: 'nofw',
    label: 'No compliance programme / Information Officer not registered',
    hint: 'Every SA organisation must register an Information Officer and run a compliance framework. Having neither signals negligence from day one.',
  },
  {
    id: 'ignored',
    label: 'Ignored data subject requests or objections',
    hint: 'People asked you to stop, delete, or show their data and you didn\'t respond. Regulator complaints usually start exactly here.',
  },
];

const MAX_FINE = 10_000_000;
const fmt = (n) => `R${Math.round(n).toLocaleString('en-ZA')}`;

const S109_FACTORS = [
  'How serious the infringement is, and whether the public interest is harmed',
  'How many data subjects are affected, and for how long',
  'Whether you acted deliberately or negligently',
  'Whether you had safeguards in place and carried out risk assessments',
  'Whether you notified affected people and cooperated with the Regulator',
  'Any previous infringements or enforcement history',
];

const CASES = [
  {
    who: 'Department of Justice',
    what: 'R5 million administrative fine (2023) — the first under POPIA. A ransomware attack exposed personal information; the Department had let its security software licences lapse and then failed to comply with the Regulator\'s enforcement notice.',
  },
  {
    who: 'Dis-Chem',
    what: 'Enforcement notice (2022) after a third-party operator was brute-forced, exposing 3.6 million records. The Regulator faulted weak operator contracts and missing security audits — third-party failures land on you.',
  },
  {
    who: 'TransUnion',
    what: 'Investigated after a 2022 credential-based breach affecting millions of South Africans. Credential hygiene and vendor access controls are now standing items in Regulator assessments.',
  },
];

const CHECKLIST = [
  'Register your Information Officer with the Information Regulator (mandatory, free, takes a day)',
  'Map what personal information you hold, where it lives, and why you have it',
  'Delete or de-identify data you no longer need — smaller footprint, smaller exposure',
  'Put written contracts with security obligations in place with every operator (hosting, payroll, marketing platforms)',
  'Fix the basics: MFA everywhere, patched systems, encrypted laptops and backups',
  'Write and publish a POPIA-aligned privacy policy (our free generator does this)',
  'Set up a breach response plan: who assesses, who notifies the Regulator, within what timeline',
  'Get direct-marketing consent records in order — opt-ins, opt-outs, and the once-only rule',
  'Train staff who handle personal information — most breaches start with a person, not a system',
  'Schedule an annual review: risk assessment, vendor audit, policy refresh',
];

const OptionCard = ({ selected, onSelect, label, hint, type = 'radio', name }) => (
  <label className={`block p-4 rounded-lg border cursor-pointer transition-colors ${selected ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
    <span className="flex items-center gap-3">
      <input type={type} name={name} checked={selected} onChange={onSelect} className="accent-emerald-500" />
      <span className="text-sm font-semibold">{label}</span>
    </span>
    <span className="block text-sm text-primary/65 leading-relaxed mt-1.5 ml-7">{hint}</span>
  </label>
);

const FineCalculator = () => {
  const [breach, setBreach] = useState(null);
  const [records, setRecords] = useState(null);
  const [aggs, setAggs] = useState([]);
  const [show, setShow] = useState(false);

  const breachW = breach ? BREACH_TYPES.find((b) => b.id === breach).weight : 0;
  const recordF = records ? RECORD_BANDS.find((r) => r.id === records).factor : 0;
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
      intro="POPIA — South Africa's privacy law — lets the Information Regulator fine organisations up to R10 million per infringement, and some violations are criminal offences. New to this? Every option below explains itself. Answer three questions to see your exposure band."
    >
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">1</span><h2 className="text-xl md:text-2xl font-bold">What went wrong (or could go wrong)?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">Pick the closest match — if several apply, pick the most serious one.</p>
          <div className="space-y-2">
            {BREACH_TYPES.map((b) => (
              <OptionCard key={b.id} name="breach" selected={breach === b.id} onSelect={() => setBreach(b.id)} label={b.label} hint={b.hint} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">2</span><h2 className="text-xl md:text-2xl font-bold">How many people's information is involved?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">Count people, not files — one customer in five systems is one data subject.</p>
          <div className="grid md:grid-cols-2 gap-2">
            {RECORD_BANDS.map((r) => (
              <OptionCard key={r.id} name="records" selected={records === r.id} onSelect={() => setRecords(r.id)} label={r.label} hint={r.hint} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2"><span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center font-bold">3</span><h2 className="text-xl md:text-2xl font-bold">Anything that makes it look worse?</h2></div>
          <p className="text-sm text-primary/60 mb-4 ml-12">These are the factors the Regulator weighs when deciding how hard to hit. Tick all that apply.</p>
          <div className="space-y-2">
            {AGGRAVATING.map((a) => (
              <OptionCard key={a.id} type="checkbox" selected={aggs.includes(a.id)} onSelect={() => toggleAgg(a.id)} label={a.label} hint={a.hint} />
            ))}
          </div>
        </div>

        <button
          onClick={() => setShow(true)}
          disabled={!breach || !records}
          className="bg-accent text-background px-8 py-4 rounded-full font-semibold disabled:opacity-40 hover:scale-105 transition-transform"
        >
          Estimate my exposure
        </button>

        {show && breach && records && (
          <div className="space-y-6">
            <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Estimated administrative fine exposure</p>
              <p className="text-4xl md:text-5xl font-black text-accent mb-4">
                {fmt(low)} – {fmt(high)}
              </p>
              {criminal && (
                <p className="text-sm text-red-400 leading-relaxed mb-4">
                  ⚠ Because account numbers are involved: sections 105–106 make this a potential criminal
                  offence — fines and/or imprisonment of up to 10 years, separate from any administrative fine.
                </p>
              )}
              <p className="text-primary/75 text-[15px] leading-relaxed mb-4">
                This is a directional band, not a prediction — the Regulator sets actual fines case by case
                using the section 109 factors below. And the fine is only part of the bill: section 99 lets
                affected people sue for damages (including for distress) without proving you were negligent.
              </p>
              <div className="border-t border-white/5 pt-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">What the Regulator weighs (s109(3))</p>
                <ul className="space-y-2">
                  {S109_FACTORS.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-primary/75">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-accent rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Gated
              tool="popia-fine-calculator"
              context={{ breach, records, aggravating: aggs, band: [Math.round(low), Math.round(high)] }}
              heading="Free: your 10-step exposure reduction plan"
              bullets={[
                'The 10 actions that most reduce your fine exposure, in priority order',
                'Which ones the Regulator checked first in every enforcement action so far',
                'Where to start if you have no compliance programme at all',
              ]}
              buttonLabel="Show my reduction plan"
            >
              <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Your 10-step exposure reduction plan</p>
                <ol className="space-y-3">
                  {CHECKLIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-primary/80">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/50 text-accent flex items-center justify-center font-bold text-sm">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="text-primary/70 text-sm mt-6">
                  Want this done for you? Our <a href="/services/privacy-audit" className="text-accent hover:underline">Privacy Audit</a> covers
                  every item above with a prioritised remediation roadmap.
                </p>
              </div>
            </Gated>

            <div className="p-8 bg-[#0B0E14] border border-white/10 rounded-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-4">Real enforcement so far</p>
              <div className="space-y-4">
                {CASES.map((c) => (
                  <div key={c.who}>
                    <p className="font-bold text-sm mb-1">{c.who}</p>
                    <p className="text-primary/70 text-[15px] leading-relaxed">{c.what}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/5 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
          <ul className="space-y-1.5 text-sm text-primary/60">
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">
                Protection of Personal Information Act 4 of 2013
              </a>{' '}
              — s109 (administrative fines), s99 (civil remedies), s100–106 (offences), s69 (direct marketing), s22 (breach notification)
            </li>
            <li>
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">
                Information Regulator (South Africa)
              </a>{' '}
              — enforcement notices, media statements, and the Department of Justice fine announcement
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            General guidance, not legal advice. Estimates are a transparent severity heuristic against the
            statutory R10m cap — actual penalties are at the Regulator's discretion.
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default FineCalculator;
