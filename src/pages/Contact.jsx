import React, { useEffect, useRef } from 'react';
import { ArrowRight, Mail, Globe, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const Contact = () => {
   const glowRef = useRef(null);

   useEffect(() => {
      // Simple mouse tracking for the contact glow
      const moveGlow = (e) => {
         if(!glowRef.current) return;
         const rect = document.querySelector('.contact-container').getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         
         gsap.to(glowRef.current, {
            x: x - 400, // half width
            y: y - 400, // half height
            duration: 0.5,
            ease: 'power2.out'
         });
      };

      window.addEventListener('mousemove', moveGlow);
      return () => window.removeEventListener('mousemove', moveGlow);
   }, []);

  return (
    <div className="contact-container w-full bg-[#05070A] min-h-[90vh] flex flex-col justify-center pt-32 pb-24 px-6 relative overflow-hidden border-t border-accent/20">
      
      {/* Interactive Cursor Glow */}
      <div ref={glowRef} className="absolute top-0 left-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-50 transition-opacity duration-1000"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center">
         
         <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
         </div>

         <div className="text-center mb-20">
            <h1 className="text-7xl md:text-[8rem] font-sans font-extrabold text-primary mb-2 tracking-tighter leading-none mix-blend-difference">
               Initiate
            </h1>
            <h1 className="text-7xl md:text-[8rem] font-drama italic text-accent font-normal tracking-tight leading-none drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
               protocol.
            </h1>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl border-t border-primary/20 pt-16">
           {/* Vault Button 1 */}
           <a href="mailto:william@securepathconsulting.co.za" className="bg-transparent border border-primary/30 p-10 hover:bg-primary text-primary hover:text-background transition-colors duration-500 flex flex-col items-start justify-between min-h-[250px] group relative overflow-hidden">
              <Mail className="w-10 h-10 mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div>
                 <h3 className="font-bold text-2xl font-sans mb-3">Secure Transmission</h3>
                 <p className="font-mono text-sm opacity-60 group-hover:opacity-100">william@securepathconsulting.co.za</p>
              </div>
              <ArrowRight className="absolute bottom-10 right-10 w-6 h-6 transform -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
           </a>

           {/* Vault Button 2 */}
           <a href="https://www.securepathconsulting.co.za" target="_blank" rel="noreferrer" className="bg-transparent border border-primary/30 p-10 hover:bg-accent text-primary hover:text-background transition-colors duration-500 flex flex-col items-start justify-between min-h-[250px] group relative overflow-hidden">
              <Globe className="w-10 h-10 mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div>
                 <h3 className="font-bold text-2xl font-sans mb-3">Enterprise Portal</h3>
                 <p className="font-mono text-sm opacity-60 group-hover:opacity-100">www.securepathconsulting.co.za</p>
              </div>
              <ArrowRight className="absolute bottom-10 right-10 w-6 h-6 transform -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
           </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
