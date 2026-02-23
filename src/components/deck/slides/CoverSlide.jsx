import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';

const CoverSlide = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-[4%] text-white">
    <VideoBackground src="https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8" />
    
    <div className="absolute top-[4%] left-[4%] right-[4%] flex justify-between justify-items-center items-center z-10">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Company Profile</span>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center text-center mt-[-3%]">
      <h1 className="text-[clamp(32px,4.5vw,96px)] tracking-[-0.02em] leading-[1.05] font-bold text-white mb-[1.5%]">Securepath Consulting</h1>
      <h2 className="text-[clamp(20px,2.5vw,48px)] opacity-90 font-medium text-white mb-[2%]">Boutique expertise, bespoke solutions tailored to modern threats.</h2>
      <p className="text-[clamp(14px,1.5vw,24px)] opacity-75 text-white">Proactive Cybersecurity</p>
    </div>

    <div className="absolute bottom-[4%] w-full text-center z-10 text-[clamp(12px,1.05vw,20px)] opacity-60 text-white">
      2026
    </div>
  </div>
);

export default CoverSlide;
