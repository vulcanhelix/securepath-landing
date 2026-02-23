import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';
import { Shield, FileCheck, Users, Lock, Briefcase } from 'lucide-react';

const Card = ({ icon: Icon, title, description, className = "" }) => (
  <div className={`relative overflow-hidden rounded-2xl p-[clamp(16px,2vw,32px)] flex flex-col justify-end bg-white/[0.05] border border-white/[0.12] backdrop-blur-[24px] saturate-[1.4] transition-all duration-300 group hover:bg-white/10 ${className}`}>
    <div className="absolute -top-[20%] -left-[20%] w-[150%] h-[150%] bg-gradient-radial from-white/[0.15] to-transparent opacity-50 pointer-events-none" />
    
    <Icon className="text-white w-[clamp(28px,2.5vw,40px)] h-[clamp(28px,2.5vw,40px)] mb-4 stroke-1 z-10 text-accent group-hover:scale-110 transition-transform duration-500" />
    <h3 className="text-[clamp(16px,1.5vw,28px)] font-bold mb-2 z-10 text-white leading-tight">{title}</h3>
    <p className="text-[clamp(12px,1.1vw,18px)] text-white/80 leading-[1.5] z-10">{description}</p>
  </div>
);

const ServicesSlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/fHfa8VIbBdqZelLGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[2%] h-[10%] shrink-0">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 003</span>
    </div>

    <div className="relative z-10 flex gap-[6%] flex-1 min-h-0 items-center">
      {/* Left Text Column */}
      <div className="flex-[0_0_35%] flex flex-col justify-center">
        <p className="text-[clamp(14px,1.5vw,24px)] opacity-90 mb-4 text-accent uppercase tracking-widest font-bold">Securing Your Digital Future</p>
        <h2 className="text-[clamp(32px,4vw,72px)] font-bold tracking-tight text-white leading-[1.1] mb-6">Comprehensive<br/>Cybersecurity<br/>& Privacy.</h2>
        <p className="text-[clamp(14px,1.3vw,22px)] opacity-80 leading-[1.6] text-white">
          A proactive, uncompromising approach to securing your critical assets. Connect the dots across IT, OT, and cloud environments before vulnerabilities can be exploited.
        </p>
      </div>

      {/* Right Masonry/Staggered Column */}
      <div className="flex-[0_0_59%] grid grid-cols-2 gap-[clamp(12px,1.5vw,24px)] h-full py-[2%]">
        
        {/* Column 1 (Staggered down) */}
        <div className="flex flex-col gap-[clamp(12px,1.5vw,24px)] mt-[10%]">
          <Card icon={Shield} title="Data Protection" description="A proactive approach to securing your critical assets against modern threats." className="flex-1" />
          <Card icon={Lock} title="Security Posture" description="Empowering cyber resilience with exhaustive vulnerability scans and risk analysis." className="flex-[1.2]" />
        </div>

        {/* Column 2 (Staggered up, 3 cards) */}
        <div className="flex flex-col gap-[clamp(12px,1.5vw,24px)] -mt-[5%]">
          <Card icon={FileCheck} title="Managed DSAR" description="Subject Access Requests, handled with precision and regulatory compliance." className="flex-1" />
          <Card icon={Users} title="Information Officer" description="Executive-level POPIA & Privacy leadership driving organizational compliance." className="flex-[1.2]" />
          <Card icon={Briefcase} title="Third-Party Risk" description="Securing the vendor ecosystem and holding networks accountable to class-leading standards." className="flex-1" />
        </div>

      </div>
    </div>
  </div>
);

export default ServicesSlide;
