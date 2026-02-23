import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProtocolCard = ({ index, title, description, zIndex }) => {
  return (
    <div className="protocol-card min-h-screen w-full flex items-center justify-center p-6 md:p-16 sticky top-0" style={{ zIndex }}>
      <div className="bg-[#0A0D14]/80 backdrop-blur-2xl border border-primary/20 rounded-[3rem] w-full max-w-6xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/[0.05] pointer-events-none"></div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-primary/10">
          <p className="font-mono text-accent text-sm uppercase tracking-widest mb-6 flex items-center gap-4">
             <span className="w-12 h-px bg-accent/30"></span> SEQUENCE 0{index}
          </p>
          <h3 className="text-5xl md:text-6xl font-sans font-bold text-primary mb-8 leading-[1.1]">{title}</h3>
          <p className="text-primary/60 text-xl font-light leading-relaxed">{description}</p>
        </div>
        
        <div className="w-full md:w-1/2 bg-[#05070A] flex items-center justify-center relative overflow-hidden h-full">
           {/* Dynamic Number Watermark */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] md:text-[20vw] font-drama font-bold italic text-primary/[0.02] select-none pointer-events-none z-0">
             0{index}
           </div>

           {/* Animated Geometry specific to index */}
           <div className="relative z-10 w-full h-full flex items-center justify-center">
              {index === 1 && (
                 <div className="relative w-64 h-64 flex items-center justify-center">
                   <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                   <div className="absolute inset-4 border border-accent/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                   <div className="absolute inset-12 border-t border-r border-primary/40 rounded-full animate-[spin_10s_easeInOut_infinite]" />
                   <div className="w-2 h-2 bg-accent rounded-full drop-shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                 </div>
              )}
              {index === 2 && (
                 <div className="grid grid-cols-8 grid-rows-8 gap-1 w-64 h-64 opacity-40">
                    {[...Array(64)].map((_, i) => (
                       <div key={i} className={`bg-primary ${Math.random() > 0.7 ? 'animate-[pulse_2s_ease-in-out_infinite]' : 'opacity-10'} rounded-sm`} style={{ animationDelay: `${Math.random() * 2}s` }}></div>
                    ))}
                 </div>
              )}
              {index === 3 && (
                 <div className="relative w-full px-12">
                     <svg viewBox="0 0 100 20" className="w-full h-32 stroke-accent drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" fill="none" strokeWidth="0.5">
                        <path className="waveform-path" d="M0,10 Q10,10 15,10 T30,10 L35,2 L40,18 L45,10 L100,10" />
                     </svg>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#05070A] via-transparent to-[#05070A]"></div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const Methodology = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            endTrigger: cards[i + 1],
            end: 'top top',
            pin: true,
            pinSpacing: false,
            animation: gsap.to(card.querySelector('.bg-\\[\\#0A0D14\\]\\/80'), {
              scale: 0.92,
              opacity: 0.3,
              y: -50,
              filter: 'blur(20px)',
              duration: 1,
              ease: 'power2.inOut'
            }),
            scrub: true,
          });
        }
      });
      
      // Waveform animation
      gsap.to('.waveform-path', {
         strokeDashoffset: -100,
         strokeDasharray: 100,
         duration: 2,
         ease: 'linear',
         repeat: -1
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-background pt-40 pb-48">
      <div className="text-center mb-32 max-w-4xl mx-auto px-6">
        <h2 className="text-6xl md:text-[6rem] font-sans font-extrabold text-primary mb-6 tracking-tighter leading-[0.9]">
           The Client-Centric <br/><span className="text-accent italic font-drama font-normal">Methodology.</span>
        </h2>
        <p className="text-primary/50 font-sans text-xl max-w-2xl mx-auto font-light leading-relaxed">
           We do not deploy generic templates. We execute a tailored protocol mapped directly to your organization's unique threat vectors and operational rhythm.
        </p>
      </div>

      <ProtocolCard 
        index={1} 
        title="Discovery & Analysis" 
        description="We conduct comprehensive discovery workshops and deep-dive gap analyses. This phase meticulously evaluates your existing risk posture against the most rigorous industry standards, establishing a baseline reality." 
        zIndex={10} 
      />
      <ProtocolCard 
        index={2} 
        title="Framework Implementation" 
        description="Our engineers develop bespoke policies and governance engines. These are not static documents, but threat-adaptive structures aligned tightly with global regulatory demands spanning multiple jurisdictions." 
        zIndex={20} 
      />
      <ProtocolCard 
        index={3} 
        title="Continuous Optimization" 
        description="Resilience is a verb. We deploy continuous training schemas and maintain ongoing integration of managed security solutions to ensure absolute capability upliftment across your operational landscape." 
        zIndex={30} 
      />
    </section>
  );
};

export default Methodology;
