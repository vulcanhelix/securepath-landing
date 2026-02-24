import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const container = useRef(null);
  const textContainer = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Magnetic Intro
      gsap.from('.about-intro-word', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: 'power4.out',
        duration: 1.5
      });
      
      // Horizontal Scroll Section
      const horizontalSections = gsap.utils.toArray('.horizontal-panel');
      if (horizontalSections.length) {
         gsap.to(horizontalSections, {
            xPercent: -100 * (horizontalSections.length - 1),
            ease: "none",
            scrollTrigger: {
               trigger: ".horizontal-container",
               pin: true,
               scrub: 1,
               snap: 1 / (horizontalSections.length - 1),
               end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
            }
         });
      }
      
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="w-full bg-background min-h-screen pt-32 overflow-hidden">
      
      {/* ===== INTRO ===== */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-center">
         <p className="font-mono text-accent text-sm tracking-[0.3em] uppercase mb-8">The Securepath Pedigree</p>
         
         <div ref={textContainer} className="overflow-hidden">
            <h1 className="text-6xl md:text-[8vw] leading-[0.9] text-primary font-bold tracking-tighter">
              <span className="inline-block about-intro-word">Boutique</span>{' '}
              <span className="inline-block about-intro-word font-drama italic text-primary/40 font-normal pr-4">expertise.</span><br/>
              <span className="inline-block about-intro-word font-drama italic text-accent font-normal pr-4">Bespoke</span>{' '}
              <span className="inline-block about-intro-word">solutions.</span>
            </h1>
         </div>
      </section>

      {/* ===== HORIZONTAL SCROLL STORYTELLING ===== */}
      <section className="horizontal-container w-[300vw] h-screen flex flex-nowrap bg-[#0B0E14] border-y border-primary/10 relative">
         {/* Panel 1 */}
         <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(16,185,129,0.05)_0%,_transparent_50%)]"></div>
            <div className="max-w-xl relative z-10 w-full md:w-1/2 pr-12 border-b md:border-b-0 md:border-r border-primary/10 pb-12 md:pb-0">
               <Shield className="w-16 h-16 text-accent mb-8" />
               <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 font-sans">The Genesis</h2>
               <p className="text-xl text-primary/60 font-light leading-relaxed">
                  We blend cutting-edge cybersecurity solutions with expert professional services to empower businesses in today's ruthless digital landscape. We sit at the nexus of technology and strategy.
               </p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center pt-12 md:pt-0">
               <h2 className="text-[15vw] font-drama text-primary/5 italic select-none">01</h2>
            </div>
         </div>

         {/* Panel 2 */}
         <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(16,185,129,0.05)_0%,_transparent_50%)]"></div>
            <div className="w-full md:w-1/2 flex items-center justify-center pb-12 md:pb-0 border-b md:border-b-0 md:border-r border-primary/10">
               <h2 className="text-[15vw] font-drama text-primary/5 italic select-none">02</h2>
            </div>
            <div className="max-w-xl relative z-10 w-full md:w-1/2 pl-0 md:pl-12 pt-12 md:pt-0">
               <Lock className="w-16 h-16 text-primary mb-8" />
               <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 font-sans">The Objective</h2>
               <p className="text-xl text-primary/60 font-light leading-relaxed">
                  Our comprehensive approach ensures that your digital assets are not merely protected against emerging threats, but actively fortified and optimized for relentless growth and innovation.
               </p>
            </div>
         </div>

         {/* Panel 3 */}
         <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1)_0%,_transparent_60%)]"></div>
            <div className="max-w-xl relative z-10 w-full text-center flex flex-col items-center">
               <Layers className="w-16 h-16 text-accent mb-8" />
               <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 font-sans">The Group</h2>
               <p className="text-2xl text-primary/80 font-light leading-relaxed max-w-3xl">
                  By serving as your trusted partner, we enable seamless digital transformation, foster absolute business resilience, and deliver scalable, zero-trust solutions.
               </p>
            </div>
         </div>
      </section>

    </div>
  );
};

export default About;
