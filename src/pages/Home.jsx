import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Fingerprint, Cpu } from 'lucide-react';
import { servicesData } from '../data/services';
import HeroCanvas from '../components/HeroCanvas';

const Home = () => {
  const cursorDot = useRef(null);
  
  // Custom Cursor Logic
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let rafId = null;
    let cursorX = 0;
    let cursorY = 0;

    const moveCursor = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (cursorDot.current) {
          cursorDot.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
        rafId = null;
      });
    };

    const handlePointerOver = (event) => {
      if (event.target.closest('a, button, .hover-trigger')) {
        cursorDot.current?.classList.add('cursor-active');
      }
    };

    const handlePointerOut = (event) => {
      if (event.target.closest('a, button, .hover-trigger')) {
        cursorDot.current?.classList.remove('cursor-active');
      }
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);

    return () => {
      window.removeEventListener('pointermove', moveCursor);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full bg-background overflow-x-hidden text-primary selection:bg-accent selection:text-background">
      
      {/* Performant Custom Cursor */}
      <div ref={cursorDot} aria-hidden="true" className="custom-cursor hidden md:block fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"></div>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section relative h-[100dvh] w-full flex flex-col justify-center px-6 md:px-16 overflow-hidden">
        
        {/* Dynamic Interactive WebGL-style Canvas Background */}
        <HeroCanvas />
        
        {/* Subtle overlay grid to retain the technical blueprints look, no heavy blurs */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ backgroundImage: 'radial-gradient(rgba(248, 250, 252, 0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-[#121620]/80"></div>
        </div>
        
        <div className="hero-content relative z-20 w-full max-w-7xl mx-auto mt-20 pointer-events-none">
          <div className="hero-fade flex items-center gap-4 mb-8" style={{ '--hero-delay': '120ms' }}>
            <span className="w-12 h-px bg-accent" aria-hidden="true"></span>
            <span className="text-accent font-mono text-xs uppercase tracking-[0.3em]">The Architecture of Trust</span>
          </div>
          
          <h1 className="mb-12">
             <span className="block text-6xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-sans font-extrabold uppercase leading-[0.85] tracking-tighter mb-4 text-primary w-full overflow-hidden">
               <span className="hero-word origin-bottom block" style={{ '--hero-delay': '40ms' }}>Strategic</span>
             </span>
             <span className="block text-6xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-drama italic text-accent leading-[0.85] tracking-tight w-full overflow-hidden">
               <span className="hero-word origin-bottom block" style={{ '--hero-delay': '140ms' }}>Resilience.</span>
             </span>
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
             <p className="text-xl md:text-3xl font-light text-primary/70 max-w-2xl leading-relaxed">
               For elite enterprises navigating a hostile digital topology, we engineer <span className="text-white font-medium">uncompromising defense mechanisms</span> that turn compliance into an offensive capability.
             </p>
             
             <Link to="/contact" className="hero-fade hover-trigger group relative inline-flex items-center justify-center px-8 py-5 bg-white text-background font-bold tracking-widest uppercase text-sm rounded-full overflow-hidden transition-transform duration-500 hover:scale-105 pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]" style={{ '--hero-delay': '260ms' }}>
                <span className="relative z-10 flex items-center gap-3">
                  Initiate Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
             </Link>
          </div>
        </div>
      </section>

      {/* ===== THESIS / PHILOSOPHY ===== */}
      <section className="reveal-section py-32 px-6 md:px-16 border-t border-primary/10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start">
            <div className="md:col-span-5">
               <h2 className="text-4xl md:text-6xl font-drama text-white leading-tight">
                  Security is not a checklist.<br />
                  <span className="text-primary/40 italic">It is a living organism.</span>
               </h2>
            </div>
            
            <div className="md:col-span-6 md:col-start-7 space-y-12">
               <p className="text-2xl text-primary/70 font-light leading-relaxed">
                  The modern threat landscape moves faster than static policies. This gives us access to deep, multi-sector adversarial intelligence. 
               </p>
               <p className="text-lg text-primary/50 font-mono leading-relaxed">
                  Our consultancy bridges the catastrophic gap between boardroom objectives and technical execution. We do not just block threats. We map your data flows, audit your third-party perimeter, and build frameworks that anticipate attack vectors before they materialize.
               </p>
               
               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-primary/10">
                  <div>
                     <div className="flex items-center text-4xl lg:text-5xl font-sans font-bold text-accent mb-2">
                        <span>9+</span>
                     </div>
                     <div className="text-xs font-mono uppercase tracking-widest text-primary/60">Global Frameworks Mastered</div>
                  </div>
                  <div>
                     <div className="text-4xl lg:text-5xl font-sans font-bold text-white mb-2">360°</div>
                     <div className="text-xs font-mono uppercase tracking-widest text-primary/60">Ecosystem Visibility</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ===== METRICS OF RESILIENCE ===== */}
      <section className="metrics-section py-32 bg-[#080a0f] border-t border-b border-white/5 relative overflow-hidden" aria-labelledby="resilience-metrics-heading">
         <h2 id="resilience-metrics-heading" className="sr-only">Securepath resilience metrics</h2>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
               <div className="text-6xl md:text-8xl font-sans font-black text-white mb-4 tracking-tighter">
                  <span>50+</span>
               </div>
               <h3 className="text-xl font-bold text-accent mb-2">Data Risk Assessments Delivered</h3>
               <p className="text-primary/50 text-sm font-mono max-w-xs">Comprehensive gap analyses and remediation roadmaps delivered across GDPR, POPIA, and PDPL mandates.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
               <div className="text-6xl md:text-8xl font-sans font-black text-white mb-4 tracking-tighter">
                  <span>24+</span>
               </div>
               <h3 className="text-xl font-bold text-accent mb-2">Adversarial Simulations</h3>
               <p className="text-primary/50 text-sm font-mono max-w-xs">Active penetration testing and defensive posturing deployments per quarter.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
               <div className="text-6xl md:text-8xl font-sans font-black text-white mb-4 tracking-tighter">
                  <span>40+</span>
               </div>
               <h3 className="text-xl font-bold text-accent mb-2">Years Cybersecurity Experience</h3>
               <p className="text-primary/50 text-sm font-mono max-w-xs">Four decades of combined cyber-intelligence woven into our proprietary execution protocols.</p>
            </div>
         </div>
      </section>

      {/* ===== TYPOGRAPHIC MARQUEE ===== */}
      <section className="py-24 overflow-hidden border-y border-white/5 bg-[#0a0d14] flex items-center relative">
            <div className="marquee-container w-[200vw] flex relative z-10" aria-hidden="true">
            <div className="marquee-track flex whitespace-nowrap text-white/[0.35] font-sans font-light text-6xl md:text-7xl uppercase tracking-[0.2em]">
               <span className="mx-12">Elevate</span> <span className="mx-12">·</span> <span className="mx-12">Protect</span> <span className="mx-12">·</span> <span className="mx-12">Succeed</span> <span className="mx-12">·</span> <span className="mx-12">Secure The Core</span> <span className="mx-12">·</span>
               <span className="mx-12">Elevate</span> <span className="mx-12">·</span> <span className="mx-12">Protect</span> <span className="mx-12">·</span> <span className="mx-12">Succeed</span> <span className="mx-12">·</span> <span className="mx-12">Secure The Core</span> <span className="mx-12">·</span>
               <span className="mx-12">Elevate</span> <span className="mx-12">·</span> <span className="mx-12">Protect</span> <span className="mx-12">·</span> <span className="mx-12">Succeed</span> <span className="mx-12">·</span> <span className="mx-12">Secure The Core</span> <span className="mx-12">·</span>
               <span className="mx-12">Elevate</span> <span className="mx-12">·</span> <span className="mx-12">Protect</span> <span className="mx-12">·</span> <span className="mx-12">Succeed</span> <span className="mx-12">·</span> <span className="mx-12">Secure The Core</span> <span className="mx-12">·</span>
            </div>
         </div>
         {/* Gradient fade on edges for elegance */}
         <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#0a0d14] to-transparent z-20 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#0a0d14] to-transparent z-20 pointer-events-none"></div>
      </section>

      {/* ===== THE ARSENAL (SERVICE OFFERINGS) ===== */}
      <section className="py-40 px-6 md:px-16 bg-[#0B0E14] relative z-10 border-t border-b border-primary/5">
         <div className="max-w-7xl mx-auto">
            <div className="reveal-section mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
               <div>
                  <div className="flex items-center gap-4 mb-6">
                     <span className="w-8 h-px bg-accent"></span>
                     <span className="text-accent font-mono text-xs uppercase tracking-widest">The Arsenal</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter">Tactical <span className="font-drama italic font-normal text-primary/40">Vectors.</span></h2>
               </div>
               <p className="max-w-md text-primary/50 font-mono text-sm leading-relaxed text-right hidden md:block">
                  Select a highly-specialized service node below to examine our precise execution protocol, methodology, and the architecture of defense we will deploy for your enterprise.
               </p>
            </div>

            <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-primary/10">
               {/* Dynamically render all 8 services from the data file */}
               {servicesData.map((service, index) => {
                  const Icon = service.icon;
                  return (
                     <Link 
                        key={index} 
                        to={`/services/${service.slug}`} 
                        className="service-card group relative bg-[#0B0E14] p-10 hover:bg-[#121620] transition-colors duration-500 overflow-hidden min-h-[320px] flex flex-col justify-between"
                     >
                        <div className="relative z-10">
                           <Icon className="w-8 h-8 text-primary/30 group-hover:text-accent transition-colors duration-500 mb-8" />
                           <h3 className="text-2xl font-bold font-sans text-primary group-hover:text-white transition-colors mb-4">{service.title}</h3>
                           <p className="text-primary/60 font-mono text-xs leading-relaxed line-clamp-3 group-hover:text-primary/70 transition-colors">
                              {service.heroDescription}
                           </p>
                        </div>
                        
                        <div className="relative z-10 mt-8 flex justify-end">
                           <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-[#0B0E14] transition-all duration-300">
                              <ArrowRight className="w-4 h-4" />
                           </div>
                        </div>

                        {/* Minimal Hover Indicator (Performant) */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-20"></div>
                     </Link>
                  )
               })}
            </div>
         </div>
      </section>

      {/* ===== METHODOLOGY HIGH-SPEED TEASER ===== */}
      <section className="reveal-section py-40 px-6 md:px-16 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-drama text-primary/40 italic mb-16">The Anatomy of an Audit.</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
               {[
                  { icon: Crosshair, title: "Recon", desc: "Mapping your attack surface." },
                  { icon: Fingerprint, title: "Identify", desc: "Discovering latent vulnerabilities." },
                  { icon: Cpu, title: "Harden", desc: "Deploying the defense paradigm." }
               ].map((step, idx) => (
                  <React.Fragment key={idx}>
                     <div className="hover-trigger reveal-section group flex flex-col items-center max-w-xs p-8 rounded-2xl border border-transparent hover:border-primary/10 transition-colors duration-500">
                        <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-accent transition-all duration-500">
                           <step.icon className="w-6 h-6 text-primary group-hover:text-accent" />
                        </div>
                        <h3 className="text-xl font-bold font-sans text-white mb-2">{step.title}</h3>
                        <p className="text-sm font-mono text-primary/50">{step.desc}</p>
                     </div>
                     {idx < 2 && (
                        <div className="hidden md:block w-16 h-px bg-gradient-to-r from-primary/30 to-transparent flex-shrink-0" />
                     )}
                  </React.Fragment>
               ))}
            </div>

            <div className="mt-20">
               <Link to="/methodology" className="inline-flex items-center gap-2 text-accent font-mono text-sm tracking-widest uppercase hover:text-white transition-colors border-b border-accent/30 pb-2">
                  View Full Methodology <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>

      {/* ===== GLOBAL ARCHITECTURE MAPPING ===== */}
      <section className="reveal-section py-32 px-6 md:px-16 bg-[#0a0d14] border-t border-white/5 relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 justify-between items-start">
               <div className="md:w-1/3">
                  <h2 className="text-4xl md:text-5xl font-sans font-bold text-white leading-tight mb-6">Global Compliance,<br/><span className="text-accent">Localized Execution.</span></h2>
                  <p className="text-primary/60 font-mono text-sm leading-relaxed mb-8">
                     Regulatory perimeters are constantly evolving. Our architecture naturally aligns your operations against the most stringent, globally-recognized data protection acts.
                  </p>
               </div>
               <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                     { region: "Europe", law: "GDPR", desc: "General Data Protection Regulation" },
                     { region: "South Africa", law: "POPIA", desc: "Protection of Personal Information Act" },
                     { region: "Saudi Arabia", law: "KSA PDPL", desc: "Personal Data Protection Law" },
                     { region: "Mauritius", law: "Mauritius DPA", desc: "Data Protection Act" },
                     { region: "Kenya", law: "Kenya DPA", desc: "Data Protection Act" },
                     { region: "Global", law: "ISO 27001", desc: "Information Security Management" }
                  ].map((item, idx) => (
                     <div key={idx} className="p-6 border border-white/5 bg-[#121620] hover:border-accent/30 transition-colors duration-500 flex flex-col justify-center">
                        <div className="text-xs font-mono text-accent mb-2 uppercase tracking-widest">{item.region}</div>
                        <div className="text-2xl font-bold font-sans text-white mb-2">{item.law}</div>
                        <div className="text-sm text-primary/60 font-mono">{item.desc}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ===== MASSIVE CTA ===== */}
      <section className="cta-section py-32 px-6 border-t border-primary/10 bg-[#0A0D14] flex flex-col items-center justify-center text-center overflow-hidden">
         <div className="max-w-4xl relative z-10 w-full">
            <h2 className="cta-massive text-6xl md:text-[8rem] lg:text-[10rem] font-sans font-black tracking-tighter leading-[0.8] text-white uppercase mb-12 mix-blend-difference hover-trigger cursor-pointer transition-colors hover:text-accent">
               <Link to="/contact">Secure <br/> The Core.</Link>
            </h2>
            <p className="text-xl md:text-2xl text-primary/50 font-light max-w-2xl mx-auto mb-16">
               Your architecture is exposed. It's time to engineer absolute resilience with Securepath Consulting.
            </p>
            <Link to="/contact" className="hover-trigger relative inline-flex items-center justify-center px-12 py-6 border border-accent/50 text-accent font-bold tracking-[0.2em] uppercase text-sm rounded-full overflow-hidden transition-all duration-500 hover:bg-accent hover:text-background shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_80px_rgba(16,185,129,0.3)]">
               Initialize Dialogue
            </Link>
         </div>
      </section>

    </div>
  );
};

export default Home;
