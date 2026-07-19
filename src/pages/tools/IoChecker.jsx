import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

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
            <p className="text-lg font-bold mb-1">1. Does your organisation operate in South Africa, or process personal information using means in South Africa?</p>
            <p className="text-sm text-primary/60 mb-3">Registered in SA, staff in SA, or SA customers whose data you hold — any of these counts. Foreign companies using SA-based servers or agents count too.</p>
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
              <p className="text-lg font-bold mb-1">2. Do you process any personal information — customers, employees, suppliers, even B2B contacts?</p>
              <p className="text-sm text-primary/60 mb-3">"Processing" is almost anything: storing a customer list, running payroll, CCTV footage, a newsletter. Remember POPIA also protects company (juristic person) information — a B2B prospect list counts.</p>
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
              <p className="text-lg font-bold mb-1">3. Is your Information Officer already registered with the Information Regulator?</p>
              <p className="text-sm text-primary/60 mb-3">Not sure? Then almost certainly no — registration is a deliberate act on the Regulator's eServices portal, and someone in your business would know they did it.</p>
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
                  <p className="text-primary/70 text-[15px] leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {done && needsIo && (
          <Gated
            tool="information-officer-checker"
            context={{ answers }}
            heading="Free: the Information Officer first-90-days pack"
            bullets={[
              'The exact eServices registration walkthrough, with the details to gather before you start',
              'The IO\'s legal duties translated into a monthly task list',
              'The two documents the Regulator asks for first in any investigation',
            ]}
            buttonLabel="Show the first-90-days pack"
          >
            <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Information Officer: first 90 days</p>
              <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                <div>
                  <p className="font-bold mb-2">Days 1–14: register</p>
                  <p className="text-primary/70">Gather before you start: company registration number, the head-of-body's details, the IO and any deputies' names, ID numbers and contact details. Register on the Regulator's eServices portal, save the confirmation PDF, and record the delegation in a signed one-page authorisation if the CEO is delegating.</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Days 15–45: the two critical documents</p>
                  <p className="text-primary/70">Investigators ask for your PAIA manual and your compliance framework first. The PAIA manual is a published document describing your records and how to request them. The framework is your written plan: what data you hold, the lawful basis for each use, safeguards, breach procedure, and training schedule. Neither needs to be long — both need to exist.</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Days 46–90: make it real</p>
                  <p className="text-primary/70">Run one staff awareness session (keep the attendance register — it's evidence). Do a first personal information impact assessment on your highest-risk process. Set the annual review date. From here the role is maintenance, not a project.</p>
                </div>
              </div>
              <p className="text-primary/70 text-sm mt-6">
                Rather not carry this in-house? Our <a href="/services/information-officer" className="text-accent hover:underline">Information Officer as a Service</a> takes
                the whole role — registration, PAIA manual, framework, and Regulator liaison.
              </p>
            </div>
          </Gated>
        )}

        <div className="border-t border-white/5 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
          <ul className="space-y-1.5 text-sm text-primary/60">
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">POPIA</a>{' '}
              — s55 (IO duties), s56 (deputies), s1 read with PAIA s1 (who the IO is by default)
            </li>
            <li>
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">Information Regulator</a>{' '}
              — Guidance Note on Information Officers and the eServices registration portal
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            General guidance, not legal advice. Public bodies have additional PAIA obligations not covered here.
          </p>
        </div>

        <p className="text-primary/60 text-sm">
          Don't want to carry the role in-house? See our{' '}
          <Link to="/services/information-officer" className="text-accent hover:underline">Information Officer as a Service</Link> offering.
        </p>
      </div>
    </ToolShell>
  );
};

export default IoChecker;
