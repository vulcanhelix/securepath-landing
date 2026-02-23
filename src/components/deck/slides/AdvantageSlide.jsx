import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';

const AdvantageSlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[4%] h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 002</span>
    </div>

    <div className="relative z-10 mb-[6%]">
        <h2 className="text-[clamp(28px,3.5vw,64px)] tracking-[-0.02em] font-bold text-white leading-tight">
          The Securepath Advantage
        </h2>
        <p className="text-[clamp(14px,1.5vw,24px)] opacity-80 mt-2 text-white max-w-[60%]">
          Transform compliance into a competitive advantage with our elite experience.
        </p>
    </div>

    <div className="relative z-10 flex gap-[4%] flex-1">
      <div className="flex-1 flex flex-col gap-4 border-t border-white/20 pt-6">
        <span className="text-[clamp(24px,2.5vw,48px)] font-bold text-accent">01 //</span>
        <h3 className="text-[clamp(18px,1.8vw,32px)] font-bold text-white mb-2">Unbiased Security Evaluation</h3>
        <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6]">
          We utilize rigorous methodologies to conduct unbiased assessments, bypassing internal familiarity bias to uncover latent vulnerabilities your internal teams might miss.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 border-t border-white/20 pt-6 mt-[4%]">
        <span className="text-[clamp(24px,2.5vw,48px)] font-bold text-accent">02 //</span>
        <h3 className="text-[clamp(18px,1.8vw,32px)] font-bold text-white mb-2">Scalable Architectures</h3>
        <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6]">
          A privacy program shouldn't be a compliance checklist. We ensure cross-functional alignment so that privacy enables your business rather than hindering it.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 border-t border-white/20 pt-6 mt-[8%]">
        <span className="text-[clamp(24px,2.5vw,48px)] font-bold text-accent">03 //</span>
        <h3 className="text-[clamp(18px,1.8vw,32px)] font-bold text-white mb-2">Strategic Roadmaps</h3>
        <p className="text-[clamp(13px,1.1vw,20px)] text-white/80 leading-[1.6]">
          Insight without action is useless. We provide a clear, prioritized path forward, empowering leadership to make informed investments that demonstrably reduce breach exposure.
        </p>
      </div>
    </div>
  </div>
);

export default AdvantageSlide;
