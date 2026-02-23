import React from 'react';
import VideoBackground from '../VideoBackground';

const QuoteSlide = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-[5.2%] z-10 text-center text-white">
    <VideoBackground src="https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8" />
    
    <div className="relative z-10 max-w-[70%] flex flex-col gap-[12px]">
      <span className="text-[clamp(14px,1.5vw,20px)] opacity-90 text-white">William, Securepath Consulting</span>
      <p className="text-[clamp(28px,3.5vw,64px)] tracking-[-0.02em] leading-[1.15] font-bold text-white">
        &ldquo;We don't just react to anomalies&mdash;we engineer environments that anticipate them.&rdquo;
      </p>
    </div>
  </div>
);

export default QuoteSlide;
