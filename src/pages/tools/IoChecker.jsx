import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolShell from '../../components/ToolShell';

const STEPS = [
  { title: 'Identify your Information Officer', body: 'By default it is the head of your organisation — the CEO, MD, or equivalent. The head may authorise another employee to act as IO, and may designate Deputy Information Officers to carry the operational load.' },
  { title: 'Register on the Information Regulator\'s eServices portal', body: 'Registration is done through the Regulator\'s online eServices portal (justice.gov.za/inforeg). You will need the organisation\'s details, the IO\'s details, and any deputies. Registration must happen before the IO takes up duties.' },
  { title: 'Document the delegation', body: 'If the head delegates the role or appoints deputies, record it in writing. The head remains ultimately accountable — delegation shifts work, not responsibility.' },
  { title: 'Publish and maintain your PAIA manual', body: 'Every private body must have a PAIA manual describing its records and how to request access. The IO is responsible for keeping it accurate and available on your website and at your offices.' },
  { title: 'Build the compliance framework', body: 'The Regulator expects the IO to develop, implement and monitor a compliance framework: personal information impact assessments, internal awareness training, request-handling procedures, and security safeguard reviews.' },
];

const IoChecker = () => {
  const [answers, setAnswers] = useState({});
  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const { sa, processes, registered } = answers;
  const needsIo = sa === 'yes' && processes === 'yes';
  const done = sa !== undefined && (sa === 'no' || processes !== undefined) && (needsIo ? registered !== undefined : true);

  return (
    <ToolShell
      slug="information-officer-checker"
      intro="Three questions to check whether you must register an Information Officer with South Africa's Information Regulator — plus the exact steps to do it."
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <p className="text-lg font-bold mb-3">1. Does your organisation operate in South Africa, or process personal information using means in South Africa?</p>
            <div className="flex gap-2">
              {['yes', 'no'].map((v) => (
                <button key={v} onClick={() => set('sa', v)} className={`px-6 py-2 rounded-full text-sm border capitalize transition-colors ${sa === v ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-primary/50 hover:border-white/30'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {sa === 'yes' && (
            <div>
              <p className="text-lg font-bold mb-3">2. Do you process any personal information — customers, employees, suppliers, even B2B contacts?</p>
              <div className="flex gap-2">
                {['yes', 'no'].map((v) => (
                  <button key={v} onClick={() => set('processes', v)} className={`px-6 py-2 rounded-full text-sm border capitalize transition-colors ${processes === v ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-primary/50 hover:border-white/30'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {needsIo && (
            <div>
              <p className="text-lg font-bold mb-3">3. Is your Information Officer already registered with the Information Regulator?</p>
              <div className="flex gap-2">
                {['yes', 'no'].map((v) => (
                  <button key={v} onClick={() => set('registered', v)} className={`px-6 py-2 rounded-full text-sm border capitalize transition-colors ${registered === v ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-primary/50 hover:border-white/30'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {done && (
          <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
            {sa === 'no' && (
              <p className="text-primary/70 text-sm leading-relaxed">
                POPIA likely does not apply to you, so no Information Officer registration is required.
                If you serve EU or UK customers, check whether GDPR applies instead.
              </p>
            )}
            {sa === 'yes' && processes === 'no' && (
              <p className="text-primary/70 text-sm leading-relaxed">
                In practice, virtually every organisation processes some personal information (employee records
                alone qualify). If you truly process none, no registration is needed — but re-check that assumption:
                payroll, CCTV, and marketing lists all count.
              </p>
            )}
            {needsIo && registered === 'yes' && (
              <p className="text-primary/70 text-sm leading-relaxed">
                Good — you are registered. Verify the registration reflects your current IO and deputies, and
                confirm the IO is delivering the duties below (PAIA manual, compliance framework, training).
                Registration without an active compliance programme will not protect you in an investigation.
              </p>
            )}
            {needsIo && registered === 'no' && (
              <p className="text-sm text-red-400 leading-relaxed">
                ⚠ You are required to register an Information Officer. Every South African organisation
                processing personal information has one by law (the head of the body) — registration with
                the Regulator is mandatory before the IO performs their duties. Follow the steps below.
              </p>
            )}
          </div>
        )}

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-6">Registration &amp; compliance steps</p>
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full border border-accent/30 text-accent flex items-center justify-center font-mono text-sm">{i + 1}</span>
                <div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <p className="text-primary/60 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary/50 text-sm">
          Don't want to carry the role in-house? See our{' '}
          <Link to="/services/information-officer" className="text-accent hover:underline">Information Officer as a Service</Link> offering.
        </p>
      </div>
    </ToolShell>
  );
};

export default IoChecker;
