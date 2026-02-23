import React from 'react';

export const LogoIcon = ({ className = "w-10 h-10", color = "#10B981" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g transform="translate(50 50) rotate(45) translate(-50 -50)">
      {/* Top-left piece */}
      <path d="M30 30 L45 30 A 15 15 0 0 1 60 45 L60 45 A 5 5 0 0 1 55 50 L35 50 A 5 5 0 0 1 30 45 Z" fill={color} className="opacity-90"/>
      {/* Top-right piece */}
      <path d="M70 30 L70 45 A 15 15 0 0 1 55 60 L55 60 A 5 5 0 0 1 50 55 L50 35 A 5 5 0 0 1 55 30 Z" fill={color} className="opacity-80"/>
      {/* Bottom-right piece */}
      <path d="M70 70 L55 70 A 15 15 0 0 1 40 55 L40 55 A 5 5 0 0 1 45 50 L65 50 A 5 5 0 0 1 70 55 Z" fill={color} className="opacity-90"/>
      {/* Bottom-left piece */}
      <path d="M30 70 L30 55 A 15 15 0 0 1 45 40 L45 40 A 5 5 0 0 1 50 45 L50 65 A 5 5 0 0 1 45 70 Z" fill={color} className="opacity-80"/>
      
      {/* Inner cutout for the diamond effect */}
      <rect x="42.5" y="42.5" w="15" h="15" fill="#0B0E14" rx="2" style={{ mixBlendMode: 'destination-out' }} />
    </g>
  </svg>
);

export const LogoFull = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <LogoIcon className="h-full w-auto" />
    <div className="flex flex-col justify-center">
      <span className="font-sans font-bold text-white text-lg leading-none tracking-tight">Securepath Consulting</span>
      <span className="font-mono text-[0.55rem] tracking-[0.3em] text-accent mt-1 uppercase">Elevate Protect Succeed</span>
    </div>
  </div>
);

export default LogoFull;
