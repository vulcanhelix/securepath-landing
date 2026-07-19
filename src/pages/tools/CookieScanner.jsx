import { useState } from 'react';
import ToolShell from '../../components/ToolShell';
import { supabase } from '../../utils/supabase';
import Gated from '../../components/LeadCapture';

const CATEGORY_NOTES = {
  Advertising: 'Requires prior consent in the EU/UK. Under POPIA, behavioural advertising needs a lawful basis and clear notice — consent is the safe route.',
  'Session recording': 'Records user behaviour in detail. High privacy impact — disclose clearly and obtain consent.',
  Analytics: 'Non-essential: consent required under EU/UK cookie rules. Configure IP anonymisation at minimum.',
  'Analytics (privacy-friendly)': 'Cookieless or anonymised analytics — generally lower risk, but still disclose in your privacy policy.',
  'Tag manager': 'Not a tracker itself, but loads others dynamically — audit what fires through it.',
  'Marketing automation': 'Tracks identified contacts. Needs disclosure and a lawful basis, plus opt-in for email marketing under POPIA s69.',
  'Chat / support': 'Processes visitor messages and metadata — cover it in your privacy policy and DPA with the provider.',
  'Data platform': 'Pipes data to many downstream tools — map every destination in your records of processing.',
  'Embedded content': 'Third-party embeds set their own cookies and may transfer data abroad (e.g. Google Fonts serves from US/EU servers).',
  'Consent management': 'Good — a consent tool is present. Verify it actually blocks non-essential tags until consent is given.',
};

const CookieScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('scan-site', { body: { url } });
      if (fnError || data?.error) throw new Error(data?.error || fnError.message);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const trackers = result?.trackers || [];
  const nonEssential = trackers.filter((t) => !['Consent management', 'Analytics (privacy-friendly)'].includes(t.category));

  return (
    <ToolShell
      slug="cookie-scanner"
      intro="Most websites quietly load trackers their owners forgot about — analytics, ad pixels, chat widgets — each one collecting visitor data with legal strings attached. Enter any address (yours, or a competitor's) and see what it really loads, in plain English."
    >
      <div className="space-y-8">
        <div className="flex gap-3 max-w-xl">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && url && scan()}
            placeholder="example.co.za"
            className="flex-1 bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-accent/50 focus:outline-none"
          />
          <button
            onClick={scan}
            disabled={!url || loading}
            className="bg-accent text-background px-8 py-3 rounded-full font-semibold disabled:opacity-40"
          >
            {loading ? 'Scanning…' : 'Scan'}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}. Note: sites behind aggressive bot protection may refuse automated scans.
          </p>
        )}

        {result && (
          <div className="space-y-6">
            <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Scan result — {result.finalUrl}</p>
              <p className="text-4xl font-black mb-2">
                <span className="text-accent">{trackers.length}</span> tracker{trackers.length !== 1 && 's'} detected
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-primary/60">
                <span>{result.https ? '✓ HTTPS' : '✗ No HTTPS'}</span>
                <span>{result.serverCookies} server-set cookie{result.serverCookies !== 1 && 's'} on first load</span>
                <span>{result.hasConsentTool ? '✓ Consent tool present' : nonEssential.length > 0 ? '✗ No consent tool detected' : '– No consent tool needed on this evidence'}</span>
              </div>
            </div>

            {trackers.length > 0 && (
              <div className="space-y-3">
                {trackers.map((t) => (
                  <div key={t.name} className="p-5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{t.name}</span>
                      <span className="font-mono text-xs text-accent/70 uppercase tracking-widest">{t.category}</span>
                    </div>
                    <p className="text-primary/65 text-sm leading-relaxed">{CATEGORY_NOTES[t.category]}</p>
                  </div>
                ))}
              </div>
            )}

            {nonEssential.length > 0 && !result.hasConsentTool && (
              <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/5">
                <p className="text-sm text-red-400 leading-relaxed">
                  ⚠ {nonEssential.length} non-essential tracker{nonEssential.length !== 1 && 's'} with no consent
                  management detected. If this site serves EU/UK visitors, these should not fire before consent.
                  Under POPIA, tracking that processes personal information needs a lawful basis and transparent notice.
                </p>
              </div>
            )}

            <p className="text-primary/55 text-sm leading-relaxed">
              Static scan of the page source only — scripts loaded dynamically after page render (e.g. via tag
              managers) may not be detected. A full audit requires rendering the site with a browser.
            </p>

            <Gated
              tool="cookie-scanner"
              context={{ url: result.finalUrl, trackers: trackers.map((t) => t.name), consentTool: result.hasConsentTool }}
              heading="Free: the cookie compliance fix plan"
              bullets={[
                'What a compliant consent banner must actually do (most block nothing)',
                'The exact disclosures your privacy policy needs for each tracker type found',
                'How to audit what fires through Google Tag Manager — where hidden trackers live',
              ]}
              buttonLabel="Show the fix plan"
            >
              <div className="p-8 bg-[#0B0E14] border border-accent/20 rounded-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">Cookie compliance fix plan</p>
                <div className="space-y-6 text-[15px] text-primary/80 leading-relaxed">
                  <div>
                    <p className="font-bold mb-2">1. A banner that actually blocks</p>
                    <p className="text-primary/70">The legal test is prior consent: non-essential trackers must not fire until the visitor says yes. Most banners fail this — they announce cookies while everything loads anyway. Test yours: open your site in a private window, decline, and check the network tab for analytics/ad requests. "Reject all" must be as easy as "Accept all", and declining can't degrade the site.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">2. Disclose what you found</p>
                    <p className="text-primary/70">Your privacy policy needs, per tracker: who runs it, what it collects, why, and where the data goes (most send data outside South Africa — that's a section 72 transfer). Our free privacy policy generator produces the cookie section for you.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">3. Audit your tag manager</p>
                    <p className="text-primary/70">If Google Tag Manager is present, this scan sees the container but not what fires through it. Log into GTM, list every active tag, and delete what nobody claims — abandoned pixels from old campaigns are the most common finding. Then connect your consent tool to GTM's consent mode so tags respect the banner.</p>
                  </div>
                </div>
                <p className="text-primary/70 text-sm mt-6">
                  Want a rendered, page-by-page audit instead of a source scan? Our <a href="/services/privacy-audit" className="text-accent hover:underline">Privacy Audit</a> includes
                  full website and cookie compliance review.
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
              — s11 (lawful basis for tracking that processes personal information), s69 (electronic marketing), s72 (offshore analytics/ad platforms)
            </li>
            <li>
              <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">ICO cookies guidance (PECR)</a>{' '}
              — the UK/EU prior-consent standard for non-essential cookies
            </li>
            <li>
              <a href="https://gdpr-info.eu/art-7-gdpr/" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-accent hover:underline">GDPR Article 7</a>{' '}
              — conditions for valid consent (freely given, specific, informed, withdrawable)
            </li>
          </ul>
          <p className="text-primary/55 text-sm mt-3 leading-relaxed">
            Detection is signature-based across 25 common trackers — absence of findings is not proof of compliance.
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default CookieScanner;
