import { useState } from 'react';
import { supabase } from '../utils/supabase';

// Email-gate for tools: shows a lead form; on submit saves to tool_leads
// (anon insert-only via RLS) and renders children (the unlocked content).
export const Gated = ({ tool, context, heading, bullets = [], buttonLabel = 'Unlock the full report', children }) => {
  const [form, setForm] = useState({ name: '', company: '', email: '' });
  const [state, setState] = useState('idle'); // idle | saving | error | done

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const submit = async () => {
    setState('saving');
    const lead = {
      tool,
      email: form.email,
      name: form.name || null,
      company: form.company || null,
      context: context || null,
    };
    // Edge function saves the lead AND emails the team; direct insert is the fallback
    // so the gate still unlocks if the function is down (no notification in that case).
    const { data, error: fnError } = await supabase.functions.invoke('submit-lead', { body: lead });
    if (!fnError && data?.ok) {
      setState('done');
      return;
    }
    const { error } = await supabase.from('tool_leads').insert(lead);
    setState(error ? 'error' : 'done');
  };

  if (state === 'done') return children;

  const inputCls = 'bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none';

  return (
    <div className="p-8 bg-accent/5 border border-accent/30 rounded-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{heading}</p>
      {bullets.length > 0 && (
        <ul className="space-y-2 mb-6">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-primary/80">
              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-accent rounded-full" />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input value={form.name} onChange={set('name')} placeholder="Name" className={inputCls} />
        <input value={form.company} onChange={set('company')} placeholder="Company" className={inputCls} />
        <input value={form.email} onChange={set('email')} type="email" placeholder="Work email *" className={inputCls} />
      </div>
      <button
        onClick={submit}
        disabled={!valid || state === 'saving'}
        className="bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold disabled:opacity-40"
      >
        {state === 'saving' ? 'One moment…' : buttonLabel}
      </button>
      {state === 'error' && <p className="text-red-400 text-xs mt-3">Something went wrong — please try again.</p>}
      <p className="text-primary/55 text-sm mt-4">
        We use your details to show your full report and may follow up once about your results.
        No spam, no list-selling — as you'd expect from a privacy firm.
      </p>
    </div>
  );
};

export default Gated;
