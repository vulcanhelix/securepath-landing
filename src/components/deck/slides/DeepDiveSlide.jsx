import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';
import { Server, ShieldAlert, FileSearch } from 'lucide-react';

const DeepDiveSlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[4%] h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 004</span>
    </div>

    <div className="relative z-10 flex gap-[6%] flex-1 items-center">
      {/* Left Column */}
      <div className="flex-[0_0_40%] flex flex-col">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-max mb-6">
          <Server size={18} className="text-accent" />
          <span className="text-[12px] uppercase tracking-wider font-bold">Case Focus</span>
        </div>
        <h2 className="text-[clamp(32px,4vw,72px)] tracking-[-0.02em] font-bold text-white leading-[1.1] mb-6">
          Hardening Your Cloud Productivity
        </h2>
        <p className="text-[clamp(14px,1.3vw,22px)] opacity-90 leading-[1.6] text-white">
          M365 houses your most sensitive communications and intellectual property. Our audit identifies misconfigurations, over-permissioned accounts, and latent vulnerabilities within your tenant.
        </p>
      </div>

      {/* Right Column: Stacked Glass Rows */}
      <div className="flex-[0_0_54%] flex flex-col gap-[clamp(16px,2vw,32px)]">
        {[
          { 
            icon: ShieldAlert,
            title: "Configuration & Access", 
            desc: "We analyze your M365 environment for weaknesses such as outdated settings and unenforced MFA to prevent catastrophic data breaches." 
          },
          { 
            icon: Server,
            title: "Threat Protection Optimization", 
            desc: "We ensure powerful tools like Data Loss Prevention (DLP) are optimally configured to maximize your platform's inherent security." 
          },
          { 
            icon: FileSearch,
            title: "Forensic Readiness", 
            desc: "By evaluating audit trails, we establish a proactive monitoring baseline that mitigates the risk of sophisticated phishing or ransomware attacks." 
          },
        ].map((item, idx) => (
          <div key={idx} className="relative overflow-hidden bg-white/5 backdrop-blur-[24px] saturate-[1.4] border border-white/10 rounded-2xl p-[clamp(20px,2vw,32px)] flex gap-6 items-start group hover:bg-white/10 transition-colors">
            <div className="absolute -inset-x-[50%] -top-[100%] aspect-square bg-gradient-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="shrink-0 bg-white/10 p-3 rounded-xl border border-white/5">
              <item.icon className="w-[clamp(24px,2.5vw,40px)] h-[clamp(24px,2.5vw,40px)] text-accent" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[clamp(16px,1.6vw,28px)] font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.5]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DeepDiveSlide;
