import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { servicesData } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

const ServiceOffering = () => {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const methodologyRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount when route changes
    window.scrollTo(0, 0);

    if (!service) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const tl = gsap.timeline();
      
      tl.fromTo('.back-link', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      )
      .fromTo('.hero-title-word',
        { y: 100, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.05, ease: 'expo.out' },
        '-=0.6'
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo('.hero-desc',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.6'
      );

      // 2. Value Sections Scroll Animation
      const sections = gsap.utils.toArray('.value-section');
      sections.forEach((sec, i) => {
        gsap.fromTo(sec,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 3. Methodology Scroll Animation
      gsap.fromTo('.methodology-item',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: methodologyRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, containerRef);
    
    return () => ctx.revert();
  }, [service, slug]);

  if (!service) {
    return <Navigate to="/solutions" replace />;
  }

  const Icon = service.icon;

  // Split title into words for exact animation control
  const titleWords = service.title.split(' ');

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-32 pb-24 text-primary relative overflow-hidden">
      
      {/* Cinematic Background Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/solutions" 
          className="back-link inline-flex items-center text-slate-400 hover:text-accent transition-colors duration-300 mb-12 uppercase tracking-widest text-xs font-mono"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Solutions
        </Link>
        
        {/* Hero Section */}
        <div ref={heroRef} className="mb-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <p className="hero-subtitle text-accent font-mono text-sm tracking-widest uppercase">{service.subtitle}</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-drama leading-[1.1] mb-8 overflow-hidden [perspective:1000px]">
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-4 pb-2">
                <span className="hero-title-word inline-block origin-bottom">{word}</span>
              </span>
            ))}
          </h1>
          
          <p className="hero-desc text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
            {service.heroDescription}
          </p>
        </div>

        {/* Dynamic Details / Sections */}
        <div ref={sectionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {service.sections.map((sec, i) => (
            <div key={i} className="value-section group relative p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden hover:border-accent/40 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <h3 className="text-2xl font-drama text-white mb-4">{sec.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Methodology / Approach */}
        <div ref={methodologyRef} className="mb-32 border-t border-slate-800 pt-24">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-drama text-white mb-4">Execution Protocol</h2>
            <p className="text-slate-400 font-mono uppercase tracking-widest text-xs">Our systematic approach to {service.title.toLowerCase()}</p>
          </div>
          
          <div className="space-y-6">
            {service.methodology.map((item, i) => (
              <div key={i} className="methodology-item flex flex-col md:flex-row gap-6 md:gap-12 p-8 border border-slate-800/50 bg-slate-900/20 rounded-xl hover:bg-slate-900/40 transition-colors">
                <div className="text-5xl font-drama text-accent/50 leading-none">{item.step}</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-slate-400 max-w-3xl">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion / CTA */}
        <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-drama text-white mb-6">Why Securepath?</h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed italic">
              "{service.whyUs}"
            </p>
            
            <Link 
              to="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-background font-bold uppercase tracking-wider overflow-hidden rounded-sm transition-transform hover:scale-105 duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Initiate Protocol
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ServiceOffering;
