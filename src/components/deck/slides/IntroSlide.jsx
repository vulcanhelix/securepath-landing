import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';

const IntroSlide = () => (
  <div className="relative w-full h-full p-[5.2%] flex flex-col z-10 text-white">
    <VideoBackground src="https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center mb-[3.5%] h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 001</span>
    </div>

    <h1 className="relative z-10 text-[clamp(28px,3.5vw,64px)] tracking-[-0.02em] leading-[1.05] font-bold text-white">
      The Rise of Cyber Threats <br/> in the Modern Ecosystem
    </h1>

    <div className="relative z-10 flex gap-[4%] mt-[3.5%] flex-1">
      <div className="flex-[0_0_22%] flex flex-col">
        <p className="text-[clamp(13px,1.1vw,20px)] opacity-90 leading-[1.5] mb-4 text-white">
          The global cost of cybercrime is escalating rapidly, demanding proactive defense mechanisms to protect critical assets.
        </p>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-[clamp(28px,3.5vw,64px)] font-bold text-white">$10.5T</span>
          <span className="text-[clamp(13px,1.1vw,20px)] text-white/80">2026</span>
        </div>
      </div>

      <div className="flex-[0_0_38%]">
        <p className="text-[clamp(13px,1.1vw,20px)] opacity-90 leading-[1.5] text-white">
          As digital transformation expands your network, your risk becomes the primary vulnerability. We engineer robust, secure-by-design IT infrastructures meticulously tailored for complex hybrid and multi-cloud environments, ensuring resilience is built into your foundation. We don't just react to anomalies—we engineer environments that anticipate them.
        </p>
      </div>

      <div className="flex-[0_0_20%] flex flex-col">
        <span className="text-[clamp(28px,3.5vw,64px)] font-bold text-white">360°</span>
        <p className="text-[clamp(13px,1.1vw,20px)] opacity-90 leading-[1.5] mt-2 mb-4 text-white">
          Comprehensive visibility across your entire threat landscape.
        </p>
        
        {/* Mini SVG line graph */}
        <div className="mt-auto h-[100px] w-full relative">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,40 Q25,20 50,30 T100,10 L100,50 L0,50 Z" fill="url(#grad2)" />
            <path d="M0,40 Q25,20 50,30 T100,10" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="0" cy="40" r="4" fill="#0B0E14" stroke="white" strokeWidth="2" />
            <circle cx="100" cy="10" r="4" fill="#0B0E14" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>

    <div className="absolute bottom-[4%] right-[5.2%] z-10 text-[clamp(12px,1.05vw,20px)] opacity-60 text-white">
      The Rise of Cyber Threats
    </div>
  </div>
);

export default IntroSlide;
