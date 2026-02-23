import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';

const MethodologySlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/fHfa8VIbBdqZelLGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[6%] h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 005</span>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <h2 className="text-[clamp(14px,1.5vw,24px)] uppercase tracking-widest font-bold text-accent mb-4">Our Methodology</h2>
      <h3 className="text-[clamp(32px,4vw,72px)] tracking-[-0.02em] font-bold text-white leading-tight max-w-[80%] mb-[8%]">
        A proven tripartite approach to building resilient architectures
      </h3>
    </div>

    <div className="relative z-10 flex justify-between flex-1 items-start mt-4 px-[4%]">
      {/* Connecting line */}
      <div className="absolute top-[clamp(40px,4.5vw,60px)] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent -z-10 bypass" />

      {[
        { step: "01", title: "Discovery & Analysis", desc: "Thorough analysis of your current security framework, mapping out critical risk perimeters and revealing compliance gaps." },
        { step: "02", title: "Strategic Roadmap", desc: "Development of an actionable plan balancing immediate remediation wins with long-term architecture resilience and investment." },
        { step: "03", title: "Implementation & Monitoring", desc: "Deployment of customized security nodes, ongoing audits, and establishing continuous effectiveness monitoring." }
      ].map((item, idx) => (
        <div key={idx} className="flex-[0_0_28%] flex flex-col items-center text-center relative group">
          <div className="w-[clamp(80px,9vw,120px)] h-[clamp(80px,9vw,120px)] rounded-full bg-black/40 border border-white/20 backdrop-blur-md flex items-center justify-center text-[clamp(24px,3vw,48px)] font-bold text-white mb-8 group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            {item.step}
          </div>
          <h4 className="text-[clamp(18px,1.8vw,32px)] font-bold text-white mb-4">{item.title}</h4>
          <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6]">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default MethodologySlide;
