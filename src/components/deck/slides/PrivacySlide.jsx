import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';
import { Users, Eye, Database, FileCheck } from 'lucide-react';

const PrivacySlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[4%] h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 006</span>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <h2 className="text-[clamp(14px,1.5vw,24px)] uppercase tracking-widest font-bold text-accent mb-4">Privacy & POPIA</h2>
      <h3 className="text-[clamp(32px,4vw,72px)] tracking-[-0.02em] font-bold text-white leading-tight max-w-[80%] mb-[6%]">
        Scalable Data Protection Architectures
      </h3>
    </div>

    <div className="relative z-10 flex gap-[4%] flex-1 mt-2">
      {/* Privacy Audit Card */}
      <div className="flex-1 relative overflow-hidden bg-white/5 backdrop-blur-[24px] saturate-[1.4] border border-white/10 rounded-3xl p-[clamp(24px,3vw,48px)] flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-radial from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <Eye className="w-[clamp(28px,3vw,48px)] h-[clamp(28px,3vw,48px)] text-accent" strokeWidth={1.5} />
            </div>
            <h4 className="text-[clamp(20px,2vw,36px)] font-bold text-white leading-tight">Comprehensive<br/>Privacy Audit</h4>
          </div>
          <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6] mb-6">
            A structured, deep-dive evaluation of your data protection practices combining legal, technical, and operational assessments.
          </p>
        </div>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-[clamp(13px,1.1vw,20px)] text-white/90">
            <Database className="w-5 h-5 text-accent shrink-0 mt-1" />
            <span>Data Mapping & Inventory via advanced tools.</span>
          </li>
          <li className="flex items-start gap-3 text-[clamp(13px,1.1vw,20px)] text-white/90">
            <FileCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
            <span>Dual-pronged Legal & Technical compliance review.</span>
          </li>
        </ul>
      </div>

      {/* Information Officer Card */}
      <div className="flex-1 relative overflow-hidden bg-white/5 backdrop-blur-[24px] saturate-[1.4] border border-white/10 rounded-3xl p-[clamp(24px,3vw,48px)] flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-radial from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <Users className="w-[clamp(28px,3vw,48px)] h-[clamp(28px,3vw,48px)] text-accent" strokeWidth={1.5} />
            </div>
            <h4 className="text-[clamp(20px,2vw,36px)] font-bold text-white leading-tight">Information Officer<br/>as a Service</h4>
          </div>
          <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6] mb-6">
            Navigate POPIA complexities with executive-level expertise, providing the authority necessary to drive organizational compliance.
          </p>
        </div>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-[clamp(13px,1.1vw,20px)] text-white/90">
            <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-1" />
            <span>Framework implementation & direct Board reporting.</span>
          </li>
          <li className="flex items-start gap-3 text-[clamp(13px,1.1vw,20px)] text-white/90">
            <FileSearch className="w-5 h-5 text-accent shrink-0 mt-1" />
            <span>Rigorous internal audits & breach management.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// Added icons that were implicitly relied upon in the markup above
import { ShieldAlert, FileSearch } from 'lucide-react';

export default PrivacySlide;
