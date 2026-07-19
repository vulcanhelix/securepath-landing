import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import Gated from '../../components/LeadCapture';

const DATA_TYPES = [
  'Names and contact details',
  'Identity numbers',
  'Financial and payment information',
  'Employment information',
  'Website usage data (cookies and analytics)',
  'Marketing preferences',
  'Special personal information (health, biometrics, etc.)',
];

const PURPOSES = [
  'Providing our products and services',
  'Processing payments and billing',
  'Customer support and communication',
  'Marketing (with consent or to existing customers)',
  'Legal and regulatory compliance',
  'Improving our website and services',
];

const buildPolicy = (f) => {
  const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  return `PRIVACY POLICY — ${f.company.toUpperCase()}
Last updated: ${today}

1. WHO WE ARE
${f.company} ("we", "us") is a ${f.type} operating in South Africa. We are the "responsible party" for the personal information described in this policy under the Protection of Personal Information Act, 4 of 2013 (POPIA).
Contact: ${f.email}${f.website ? `\nWebsite: ${f.website}` : ''}
${f.io ? `Information Officer: ${f.io}` : 'Information Officer: the head of our organisation (contactable at the address above).'}

2. WHAT PERSONAL INFORMATION WE COLLECT
We collect and process the following categories of personal information:
${f.dataTypes.map((d) => `  • ${d}`).join('\n')}

3. WHY WE PROCESS YOUR INFORMATION
We process personal information for these purposes:
${f.purposes.map((p) => `  • ${p}`).join('\n')}
We rely on the lawful grounds in section 11 of POPIA: your consent, the necessity of processing to conclude or perform a contract with you, compliance with legal obligations, and our legitimate interests (against which you may object at any time).

4. DIRECT MARKETING
${f.marketing
    ? 'We may send you electronic marketing where you are an existing customer (for similar products or services) or where you have given consent. Every message will include a simple opt-out, and you can withdraw consent at any time.'
    : 'We do not send electronic direct marketing.'}

5. COOKIES AND WEBSITE ANALYTICS
${f.cookies
    ? 'Our website uses cookies and similar technologies for functionality and analytics. You can control cookies through your browser settings; blocking some cookies may affect site functionality.'
    : 'Our website does not use non-essential cookies or third-party analytics.'}

6. SHARING YOUR INFORMATION
${f.sharing
    ? 'We share personal information with service providers ("operators") who process it on our behalf — such as hosting, payment, and communication providers — under written agreements requiring confidentiality and appropriate security. We do not sell personal information.'
    : 'We do not share your personal information with third parties, except where required by law.'}

7. CROSS-BORDER TRANSFERS
${f.transfers
    ? 'Some of our service providers store information outside South Africa. Where this happens, we ensure the recipient is subject to laws or binding agreements providing substantially similar protection to POPIA, as required by section 72.'
    : 'We store personal information within South Africa and do not transfer it across borders.'}

8. SECURITY
We take appropriate, reasonable technical and organisational measures to protect personal information against loss, damage, unauthorised destruction, and unlawful access, as required by section 19 of POPIA. If a security compromise occurs, we will notify the Information Regulator and affected data subjects as required by section 22.

9. RETENTION
We keep personal information only as long as necessary for the purposes above, or as required by law, after which it is deleted or de-identified.

10. YOUR RIGHTS
Under POPIA you have the right to:
  • Request access to the personal information we hold about you;
  • Request correction or deletion of inaccurate, outdated, or unlawfully held information;
  • Object to processing based on legitimate interests;
  • Object to direct marketing at any time;
  • Withdraw consent where processing is based on consent;
  • Complain to the Information Regulator (complaints.IR@inforegulator.org.za / www.inforegulator.org.za).
To exercise these rights, contact us at ${f.email}.

11. CHANGES TO THIS POLICY
We may update this policy from time to time. The latest version will always be available ${f.website ? `at ${f.website}` : 'on request'}.

---
Generated with the free Securepath Consulting POPIA Privacy Policy Generator (securepathconsulting.co.za/tools/privacy-policy-generator). This template is general guidance, not legal advice — have it reviewed for your specific circumstances.`;
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">{label}</span>
    {children}
  </label>
);

const inputCls = 'w-full bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none';

const PolicyGenerator = () => {
  const [form, setForm] = useState({
    company: '', type: 'private company', email: '', website: '', io: '',
    dataTypes: [], purposes: [], marketing: true, cookies: true, sharing: true, transfers: true,
  });
  const [policy, setPolicy] = useState(null);
  const [copied, setCopied] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, v) => set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v]);

  const canGenerate = form.company && form.email && form.dataTypes.length && form.purposes.length;

  const copy = async () => {
    await navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([policy], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${form.company.replace(/\s+/g, '-').toLowerCase()}-privacy-policy.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolShell
      slug="privacy-policy-generator"
      intro="Answer a few questions and get a POPIA-aligned privacy policy tailored to your business — free, no signup, ready to publish after a legal sanity check."
    >
      {!policy ? (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Company name *">
              <input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme (Pty) Ltd" />
            </Field>
            <Field label="Business type">
              <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option>private company</option>
                <option>sole proprietorship</option>
                <option>non-profit organisation</option>
                <option>partnership</option>
                <option>public company</option>
              </select>
            </Field>
            <Field label="Contact email *">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="privacy@acme.co.za" />
            </Field>
            <Field label="Website (optional)">
              <input className={inputCls} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://acme.co.za" />
            </Field>
            <Field label="Information Officer name (optional)">
              <input className={inputCls} value={form.io} onChange={(e) => set('io', e.target.value)} placeholder="Jane Doe" />
              <span className="block text-sm text-primary/65 leading-relaxed mt-2">Every SA organisation must have one — by default it's the CEO or owner. Leave blank and the policy names "the head of our organisation". Not registered yet? Use our free Information Officer checker.</span>
            </Field>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">What personal information do you collect? *</p>
            <div className="grid md:grid-cols-2 gap-2">
              {DATA_TYPES.map((d) => (
                <label key={d} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${form.dataTypes.includes(d) ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                  <input type="checkbox" checked={form.dataTypes.includes(d)} onChange={() => toggle('dataTypes', d)} className="accent-emerald-500" />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">Why do you process it? *</p>
            <div className="grid md:grid-cols-2 gap-2">
              {PURPOSES.map((p) => (
                <label key={p} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${form.purposes.includes(p) ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                  <input type="checkbox" checked={form.purposes.includes(p)} onChange={() => toggle('purposes', p)} className="accent-emerald-500" />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {[
              ['marketing', 'We send electronic marketing', 'Emails, SMSes, or WhatsApps promoting your products. POPIA has strict opt-in rules for this, so your policy must cover it.'],
              ['cookies', 'Our website uses cookies / analytics', 'Google Analytics, Meta Pixel, chat widgets — if your site has any of these, tick this. Unsure? Try our free cookie scanner.'],
              ['sharing', 'We use third-party service providers', 'Almost everyone does: hosting, payroll, accounting software, email tools, CRMs. POPIA calls them "operators" and your policy must mention them.'],
              ['transfers', 'Data may be stored outside South Africa', 'If you use Gmail, Microsoft 365, Xero, or most cloud software, your data leaves SA — tick this. POPIA section 72 governs it.'],
            ].map(([k, label, hint]) => (
              <label key={k} className={`block p-4 rounded-lg border cursor-pointer transition-colors ${form[k] ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <span className="flex items-center gap-3">
                  <input type="checkbox" checked={form[k]} onChange={() => set(k, !form[k])} className="accent-emerald-500" />
                  <span className="text-sm font-semibold">{label}</span>
                </span>
                <span className="block text-sm text-primary/65 leading-relaxed mt-1.5 ml-7">{hint}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => setPolicy(buildPolicy(form))}
            disabled={!canGenerate}
            className="bg-accent text-background px-8 py-4 rounded-full font-semibold disabled:opacity-40 hover:scale-105 transition-transform"
          >
            Generate my privacy policy
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-3 mb-6">
            <button onClick={copy} className="bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold">
              {copied ? 'Copied ✓' : 'Copy to clipboard'}
            </button>
            <button onClick={download} className="border border-accent/40 text-accent px-6 py-3 rounded-full text-sm font-semibold">
              Download .txt
            </button>
            <button onClick={() => setPolicy(null)} className="border border-white/20 text-primary/60 px-6 py-3 rounded-full text-sm">
              Edit answers
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-[#0B0E14] border border-white/10 rounded-lg p-8 text-primary/80 font-sans">
            {policy}
          </pre>

          <div className="mt-8">
            <Gated
              tool="privacy-policy-generator"
              context={{ company: form.company, type: form.type, email: form.email, website: form.website, dataTypes: form.dataTypes, purposes: form.purposes, marketing: form.marketing, cookies: form.cookies, sharing: form.sharing, transfers: form.transfers }}
              heading="Free: your policy implementation pack"
              bullets={[
                'Where the policy must appear (website, forms, email footers) to actually count as notice',
                'The 4 documents POPIA expects alongside a privacy policy — most businesses miss 3',
                'A 12-month compliance calendar you can hand to whoever owns this',
              ]}
              buttonLabel="Show my implementation pack"
            >
              <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Your implementation pack</p>
                <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                  <div>
                    <p className="font-bold mb-2">1. Publish it where it counts</p>
                    <p className="text-primary/70">Link the policy in your website footer, on every form that collects personal information (including newsletter signups), and in your email signature block. POPIA's openness condition requires people to be able to find it before they hand over data — a buried PDF doesn't qualify.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">2. The 4 companion documents</p>
                    <p className="text-primary/70">A privacy policy alone is not compliance. You also need: a PAIA manual (legally mandatory, published on your site); an internal data breach response procedure; operator agreements with every service provider that touches your data; and consent records for any marketing lists.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">3. Your 12-month calendar</p>
                    <p className="text-primary/70">Month 1: register your Information Officer. Month 2–3: map your data and sign operator agreements. Month 4: train staff. Month 6: run a mock data subject request. Month 9: vendor security review. Month 12: policy and risk-assessment refresh. Then repeat annually.</p>
                  </div>
                </div>
                <p className="text-primary/70 text-sm mt-6">
                  Want the whole thing handled? Our <a href="/services/customized-privacy-program" className="text-accent hover:underline">Customized Privacy Program</a> builds
                  all of this for you, or start with a <a href="/services/privacy-audit" className="text-accent hover:underline">Privacy Audit</a>.
                </p>
              </div>
            </Gated>
          </div>

          <div className="mt-12 border-t border-white/5 pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-3">Sources</p>
            <ul className="space-y-1.5 text-sm text-primary/60">
              <li>
                <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">Protection of Personal Information Act 4 of 2013</a>{' '}
                — s11 (lawful grounds), s18 (notification when collecting), s19 (security), s69 (direct marketing), s72 (cross-border transfers), s23–24 (access and correction)
              </li>
              <li>
                <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">Information Regulator (South Africa)</a>{' '}
                — complaint channels and Information Officer registration
              </li>
            </ul>
            <p className="text-primary/55 text-sm mt-3 leading-relaxed">
              This generator produces a general-purpose template aligned to POPIA's conditions. It is not legal advice — industry-specific rules (financial services, health, credit) may require additional clauses.
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
};

export default PolicyGenerator;
