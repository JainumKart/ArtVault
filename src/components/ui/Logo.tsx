'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision ArtVault Emblem: Picture Frame + Vault Wheel & Monogram */}
      <div className={`${iconSizes[size]} shrink-0 relative transition group-hover:scale-105 duration-300`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#191C24" />
              <stop offset="100%" stopColor="#0B0D12" />
            </linearGradient>

            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE69E" />
              <stop offset="35%" stopColor="#D9A834" />
              <stop offset="70%" stopColor="#B6831B" />
              <stop offset="100%" stopColor="#875B0D" />
            </linearGradient>

            <linearGradient id="logoBrightGold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C59324" />
              <stop offset="50%" stopColor="#FFF4C8" />
              <stop offset="100%" stopColor="#C59324" />
            </linearGradient>
          </defs>

          {/* Dark Obsidian Base with Chamfered Corners */}
          <rect
            x="8"
            y="8"
            width="184"
            height="184"
            rx="38"
            fill="url(#logoBg)"
            stroke="url(#logoGold)"
            strokeWidth="3"
          />

          {/* Picture Frame Molding (Art Metaphor) */}
          <rect
            x="24"
            y="24"
            width="152"
            height="152"
            rx="22"
            stroke="url(#logoGold)"
            strokeWidth="3"
            opacity="0.9"
          />
          <rect
            x="32"
            y="32"
            width="136"
            height="136"
            rx="16"
            stroke="url(#logoGold)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.45"
          />

          {/* Circular Vault Door Outer Wheel (Security / Vault Metaphor) */}
          <circle cx="100" cy="100" r="54" stroke="url(#logoGold)" strokeWidth="3" />
          <circle cx="100" cy="100" r="46" fill="#12151D" stroke="url(#logoBrightGold)" strokeWidth="1.5" />

          {/* 8 Bank Vault Locking Bolts */}
          <g stroke="url(#logoGold)" strokeWidth="3.5" strokeLinecap="round">
            <line x1="100" y1="46" x2="100" y2="38" />
            <line x1="100" y1="154" x2="100" y2="162" />
            <line x1="46" y1="100" x2="38" y2="100" />
            <line x1="154" y1="100" x2="162" y2="100" />
            <line x1="62" y1="62" x2="56" y2="56" />
            <line x1="138" y1="138" x2="144" y2="144" />
            <line x1="62" y1="138" x2="56" y2="144" />
            <line x1="138" y1="62" x2="144" y2="56" />
          </g>

          {/* Inner Combination Dial */}
          <circle cx="100" cy="100" r="34" fill="url(#logoBg)" stroke="url(#logoGold)" strokeWidth="2.5" />
          <circle
            cx="100"
            cy="100"
            r="28"
            stroke="url(#logoBrightGold)"
            strokeWidth="1"
            strokeDasharray="2 5"
            opacity="0.75"
          />

          {/* Interlocking Monogram: Painter's Easel "A" + Vault Lock Key "V" */}
          <path
            d="M100 73 L83 117 L88 117 L93 105 L107 105 L112 117 L117 117 Z"
            fill="url(#logoBrightGold)"
          />
          <line x1="93" y1="102" x2="107" y2="102" stroke="#12151D" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M84 92 L100 128 L116 92 L109 92 L100 114 L91 92 Z"
            fill="url(#logoGold)"
            opacity="0.95"
          />

          {/* Golden Center Vault Pivot Pin */}
          <circle cx="100" cy="100" r="3.5" fill="#FFF4C8" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span className={`font-serif ${textSizes[size]} font-bold tracking-tight text-foreground select-none`}>
          Art<span className="text-primary italic font-normal">Vault</span>
        </span>
      )}
    </div>
  );
}
