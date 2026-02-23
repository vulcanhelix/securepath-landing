import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Layers, Network, Server, Plus, Minus, ArrowRight } from 'lucide-react';

const SolutionNode = ({ icon: Icon, title, description, details, linkTo }) => {
   const [expanded, setExpanded] = useState(false);

   return (
      <div 
         className={`relative border-b border-primary/10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${expanded ? 'bg-[#0B0E14]' : 'hover:bg-primary/[0.02]'}`}
      >
         <div 
            className="flex items-center justify-between p-8 md:p-12 cursor-pointer group"
            onClick={() => setExpanded(!expanded)}
         >
            <div className="flex items-center gap-8 md:gap-16">
               <div className={`p-4 rounded-full border transition-colors duration-500 ${expanded ? 'border-accent bg-accent/10 text-accent' : 'border-primary/20 text-primary/40 group-hover:border-accent/50 group-hover:text-accent'}`}>
                  <Icon className="w-8 h-8" />
               </div>
               <h3 className={`text-3xl md:text-5xl font-sans font-bold tracking-tight transition-colors duration-500 ${expanded ? 'text-accent' : 'text-primary'}`}>
                  {title}
               </h3>
            </div>
            
            <button className={`p-4 rounded-full border transition-all duration-500 ${expanded ? 'border-accent bg-accent text-background rotate-180' : 'border-primary/20 text-primary group-hover:border-accent group-hover:text-accent'}`}>
               {expanded ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button>
         </div>

         <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${expanded ? 'max-h-[800px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}>
            <div className="pl-8 md:pl-[148px] pr-8 md:pr-12 max-w-4xl">
               <p className="text-xl md:text-2xl text-primary/70 font-light leading-relaxed mb-8 font-sans">
                  {description}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.map((detail, idx) => (
                     <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-primary/5 bg-[#121620]">
                        <span className="font-mono text-accent text-xs mt-1">0{idx+1}</span>
                        <span className="text-primary/80 font-mono text-sm">{detail}</span>
                     </div>
                  ))}
               </div>
               
               {linkTo && (
                  <div className="mt-8 pt-8 border-t border-primary/10">
                     <Link to={linkTo} className="group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-accent hover:text-white transition-colors duration-300">
                        Explore Full Protocol
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               )}
            </div>
         </div>
         {/* Ambient glow when expanded */}
         <div className={`absolute top-1/2 left-0 w-full h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)] -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${expanded ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
   );
};

const Solutions = () => {
  return (
    <div className="w-full bg-background min-h-screen pt-40 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
           <div className="max-w-3xl">
               <p className="text-accent font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-accent/50"></span>
                  The Architecture of Trust
               </p>
               <h1 className="text-5xl md:text-[6rem] font-sans font-bold text-primary tracking-tighter leading-[0.9]">
                  Compliance & <br/><span className="text-primary/40 italic font-drama font-normal">Security Nodes.</span>
               </h1>
           </div>
           
           <p className="text-primary/50 font-mono text-sm max-w-xs text-right">
              Select a defensive node to reveal the operational telemetry mapping.
           </p>
        </header>

        <div className="border-t border-primary/10 mb-32">
          <SolutionNode 
             icon={Target}
             title="Privacy Assessments"
             description="We ensure hermetic compliance with global regulatory standards including GDPR, POPIA, Mauritius DPA, Kenya DPA, and KSA PDPL. Eradicating legal exposure at the architectural level."
             details={["Gap analyses & audits", "DPIA execution", "DSAR processing", "Outsourced DPO & Deputy Info Officer"]}
             linkTo="/services/privacy-audit"
          />
          <SolutionNode 
             icon={Layers}
             title="Third-Party Risk"
             description="Securing your operational supply chain by comprehensively evaluating external vendor integrations, ensuring the weakest link is never yours."
             details={["Contractual cyber controls", "Data handling practices & transit", "Upstream risk management validation"]}
             linkTo="/services/third-party-risk"
          />
          <SolutionNode 
             icon={Network}
             title="Security Posture"
             description="A fundamental assessment of your architectural integrity and quantitative ability to repel, isolate, and respond to active, sophisticated incidents."
             details={["Network infrastructure auditing", "Zero-trust access controls", "Incident response readiness", "Data recovery & compartmentalization"]}
             linkTo="/services/security-posture-assessment"
          />
           <SolutionNode 
             icon={Server}
             title="Framework Engineering"
             description="Industry-specific framework implementation mapping strictly to ISO 27001, NIST, and Cyber Essentials, customized to your operational reality."
             details={["Custom procedural development", "Regulatory alignment engine mappings", "Threat-adaptive governance structures", "Business Continuity & Resilience management"]}
             linkTo="/services/cybersecurity-services"
          />
        </div>

        {/* Tactical Service Offerings Grid */}
        <div>
           <h3 className="text-3xl font-drama text-white mb-12">Tactical Service Vectors</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                 { title: "Managed DSAR Service", link: "/services/dsar-management" },
                 { title: "Information Officer", link: "/services/information-officer" },
                 { title: "Microsoft 365 Audit", link: "/services/microsoft-365-audit" },
                 { title: "Customized Privacy Program", link: "/services/customized-privacy-program" }
              ].map((service, idx) => (
                 <Link key={idx} to={service.link} className="group relative p-8 rounded-2xl border border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.05] hover:border-accent/30 transition-all duration-300 overflow-hidden flex flex-col justify-between h-48">
                    <h4 className="text-xl font-sans font-medium text-primary group-hover:text-accent transition-colors z-10">{service.title}</h4>
                    <div className="flex justify-end z-10">
                       <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-all duration-300">
                          <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                 </Link>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
