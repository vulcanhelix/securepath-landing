Build a full-screen, presentation-style slide deck web app with 5 slides, optimized for live presentation and verbal narration. Use React and Tailwind CSS. Install the hls.js package for video backgrounds and lucide-react for icons.

Global Design System:

Font: Plus Jakarta Sans (import from Google Fonts: 
@import

 url('https://fonts.googleapis.com/css2?family=Pl
us+Jakarta+Sans:wght@400;500;700&display=swap
'))
Dark/black theme throughout, all text is white
All font sizes use responsive clamp() values (e.g. clamp(12px, 1.05vw, 20px))
All spacing uses percentage-based values (e.g. px-[5.2%], pt-[4%]) for full responsiveness
No shadows anywhere — cards and UI elements use a "liquid glass" aesthetic: backdrop-filter: blur(24px) saturate(1.4), translucent white backgrounds via linear gradients (rgba(255,255,255,0.08) to rgba(255,255,255,0.03)), thin semi-transparent borders (1px solid rgba(255,255,255,0.12)), and a subtle radial specular highlight at top-left
Presentation Framework (Presentation.tsx component):

Accepts an array of slide React elements and renders them full-screen
Keyboard navigation: ArrowRight/ArrowDown/Spacebar = next slide, ArrowLeft/ArrowUp = previous slide, F = toggle fullscreen, Escape = exit fullscreen
Smooth transitions between slides: 500ms ease-in-out opacity fade + subtle scale (0.95 for past slides, 1.05 for future slides, 1 for current)
Auto-hiding controls: appear on mouse move, disappear after 3 seconds of inactivity. Fade transition (300ms)
Bottom navigation bar with: left = slide counter ("1 / 5" style, white/50 opacity, 13px, tabular-nums), center = progress dots (6px circles, current slide dot expands to 24px wide pill, white/90 for active, white/30 for inactive), right = prev/next chevron buttons + divider + fullscreen toggle button (all white/50, hover to white/90 with white/10 background)
Top-right keyboard hint text ("← → Navigate · F Fullscreen") at 11px, white/40, fades with controls
Video Backgrounds: Every slide that uses a video background should implement it identically: use hls.js — if Hls.isSupported(), create an HLS instance with enableWorker: true, load the source, attach to a <video> element, and auto-play on MANIFEST_PARSED. Fallback for Safari native HLS. The <video> element is absolute inset-0 w-full h-full object-cover, autoPlay, loop, muted, playsInline. No overlay, no dimming, 100% opacity. Content sits on top via relative z-10.

Slide 1 — Cover Slide (CoverSlide.tsx):

Video background: https://stream.mux.com/JNJEOYI6B3EffB
9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8

Header: logo (white SVG, 129×40px) on the left, "Pitch Deck" text on the right (clamp 12px–20px, opacity-80)
Center content (vertically centered, nudged up 3%): title "AI-Powered Data Analytics" (clamp 32px–96px, tracking -0.02em, line-height 1.05), subtitle "Unlocking Business Potential" (clamp 20px–48px, opacity-90, mt 1.5%), author "By John Doe" (clamp 14px–24px, opacity-75, mt 2%)
Footer: "2024" centered (clamp 12px–20px, opacity-60)
Slide 2 — Intro Slide (IntroSlide.tsx):

Video background: https://stream.mux.com/Kec29dVyJgiPdt
WaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8

Header: logo left, "Pitch Deck" center, "Page 001" right (all clamp 12px–20px, opacity-80)
Title: "The Rise of AI / in Data Analytics" (clamp 28px–64px, tracking -0.02em, line-height 1.05)
Three-column layout below title (mt 3.5%, gap 4%):Column 1 (flex 0 0 22%): paragraph about AI analytics market growth ($150B to $300B), then large "$300" stat (clamp 28px–64px) with "2027" label beside it (clamp 13px–20px, white/80)
Column 2 (flex 0 0 38%): long paragraph about businesses adopting AI-driven analysis (clamp 13px–20px, opacity-90, line-height 1.5)
Column 3 (flex 0 0 20%): "25–40%" large stat (clamp 28px–64px), description text below, and a mini SVG line graph at bottom with a curved line (white stroke), a gradient fill area (#D2FF55 to transparent), and two endpoint dots (#B750B2 fill, white stroke)

Footer: "The Rise of AI" right-aligned (clamp 12px–20px, opacity-60)
Slide 3 — Analytics Slide (AnalyticsSlide.tsx):
Video background: https://stream.mux.com/fHfa8VIbBdqZel
LGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8

Header: logo left, "Pitch Deck" center, "Page 002" right
Centered title section: "Transforming Data into Intelligence with" (clamp 14px–24px, opacity-90) above "AI-Powered Analytics" (clamp 28px–64px)

Card grid below (px 5.2%, flexible height):Top row: 3 equal liquid glass cards with gap clamp(10px–27px)
Bottom row: 2 equal liquid glass cards with gap clamp(10px–25px)
Each card has: an icon (white stroke SVG, clamp 32px–48px), title (clamp 18px–36px), description (clamp 12px–20px, white/80). Content aligned to bottom of card with padding clamp(20px–48px)
Card 1: Monitor icon, "Advanced Capabilities", "Real-time processing, predictive analytics, and machine learning."
Card 2: Brain icon, "Smarter Decision-Making", "Helping businesses unlock insights and optimize efficiency."
Card 3: Briefcase/Tie icon, "Industry Leader", "Driving AI-driven data analytics innovation."
Card 4: Lightbulb icon, "Future-Ready Solutions", "Empowering organizations to stay competitive in a data-driven world."
Card 5: Shield icon, "Scalable & Secure", "Ensuring seamless AI integration with robust data protection."

Use lucide-react icons (Monitor, Brain, Briefcase, Lightbulb, Shield) as white stroke SVGs
Slide 4 — Quote Slide (QuoteSlide.tsx):
Video background: https://stream.mux.com/4IMYGcL01xjs7e
k5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8

Centered content only, no header/footer
Attribution: "Andrew Ng" (clamp 14px–20px, opacity-90)
Quote: "Artificial Intelligence is the new electricity." in smart quotes (clamp 28px–64px, tracking -0.02em, line-height 1.15)
Max-width 70%, gap 12px between attribution and quote
Slide 5 — Outro/Contact Slide (OutroSlide.tsx):
Video background: https://stream.mux.com/00qQnfNo7sSpn3
pB1hYKkyeSDvxs01NxiQ3sr29uL3e028.m3u8

Header: logo left, "Pitch Deck" center, "Page 020" right
Main content vertically centered, left-aligned:Title: "Contact Information & / Final Call to Action" (clamp 28px–64px, tracking -0.02em, line-height 1.05)
Description paragraph (clamp 13px–20px, opacity-90, max-width 38%, mt 3%)

5 contact items stacked vertically (gap clamp 12px–19px, mt 3%), each with an icon (clamp 24px–32px) and text (clamp 13px–20px):Instagram icon → "http://Instagram.com/grapho
"
Facebook icon → "http://Facebook.com/grapho
"
Phone icon → "+1 (415) 987-6543"
Mail icon → "contact@optimalai.com"
Map Pin icon → "Headquarters: San Francisco, CA, USA"
Use lucide-react for Phone, Mail, MapPin icons. For Instagram and Facebook, use simple SVG paths (Instagram: rounded rectangle + circle, Facebook: F logo path)

App.tsx: Wire all 5 slides into the Presentation component in order: CoverSlide, IntroSlide, AnalyticsSlide, QuoteSlide, OutroSlide.