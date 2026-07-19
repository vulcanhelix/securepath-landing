import { useState } from 'react';
import ToolShell from '../../components/ToolShell';

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
    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">{label}</span>
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
            </Field>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-3">What personal information do you collect? *</p>
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-3">Why do you process it? *</p>
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
              ['marketing', 'We send electronic marketing'],
              ['cookies', 'Our website uses cookies / analytics'],
              ['sharing', 'We use third-party service providers'],
              ['transfers', 'Data may be stored outside South Africa'],
            ].map(([k, label]) => (
              <label key={k} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${form[k] ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                <input type="checkbox" checked={form[k]} onChange={() => set(k, !form[k])} className="accent-emerald-500" />
                {label}
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
        </div>
      )}
    </ToolShell>
  );
};

export default PolicyGenerator;
