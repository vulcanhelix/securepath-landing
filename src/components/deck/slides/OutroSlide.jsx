import React from 'react';
import VideoBackground from '../VideoBackground';
import { LogoFull } from '../../Logo';
import { Mail, Phone, MapPin } from 'lucide-react';

const OutroSlide = () => (
  <div className="relative w-full h-full p-[5.2%] z-10 text-white">
    <VideoBackground src="https://stream.mux.com/00qQnfNo7sSpn3pB1hYKkyeSDvxs01NxiQ3sr29uL3e028.m3u8" />
    
    <div className="relative z-10 flex justify-between items-center h-[10%]">
      <LogoFull className="h-[clamp(20px,2vw,40px)] text-white" />
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 absolute left-1/2 -translate-x-1/2 text-white">Company Profile</span>
      <span className="text-[clamp(12px,1.05vw,20px)] opacity-80 text-white">Page 007</span>
    </div>

    <div className="relative z-10 h-[90%] flex flex-col justify-center">
      <h1 className="text-[clamp(28px,3.5vw,64px)] tracking-[-0.02em] leading-[1.05] font-bold text-white">
        Contact Information & <br/> Final Call to Action
      </h1>
      
      <p className="text-[clamp(13px,1.1vw,20px)] opacity-90 max-w-[38%] mt-[3%] leading-[1.5] text-white">
        Take the first step towards absolute privacy compliance and cyber resilience. Protect your digital future today.
      </p>
      
      <div className="flex flex-col gap-[clamp(12px,1.2vw,19px)] mt-[3%]">
        <div className="flex items-center gap-4">
          <svg className="w-[clamp(24px,2vw,32px)] h-[clamp(24px,2vw,32px)] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="text-[clamp(13px,1.1vw,20px)] opacity-90 text-white">instagram.com/securepath</span>
        </div>
        
        <div className="flex items-center gap-4">
          <svg className="w-[clamp(24px,2vw,32px)] h-[clamp(24px,2vw,32px)] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
          <span className="text-[clamp(13px,1.1vw,20px)] opacity-90 text-white">facebook.com/securepath</span>
        </div>

        <div className="flex items-center gap-4">
          <Phone className="w-[clamp(24px,2vw,32px)] h-[clamp(24px,2vw,32px)] text-white" strokeWidth="2" />
          <span className="text-[clamp(13px,1.1vw,20px)] opacity-90 text-white">+27 (0) 87 123 4567</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Mail className="w-[clamp(24px,2vw,32px)] h-[clamp(24px,2vw,32px)] text-white" strokeWidth="2" />
          <span className="text-[clamp(13px,1.1vw,20px)] opacity-90 text-white">william.d@securepathconsulting.co.za</span>
        </div>

        <div className="flex items-center gap-4">
          <MapPin className="w-[clamp(24px,2vw,32px)] h-[clamp(24px,2vw,32px)] text-white" strokeWidth="2" />
          <span className="text-[clamp(13px,1.1vw,20px)] opacity-90 text-white">Headquarters: South Africa</span>
        </div>
      </div>
    </div>
  </div>
);

export default OutroSlide;
