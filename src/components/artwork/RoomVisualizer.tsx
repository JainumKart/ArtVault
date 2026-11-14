'use client';

import React, { useState } from 'react';
import { Artwork, FramingOption } from '@/types';
import { X, Sliders, Maximize2, ShieldCheck } from 'lucide-react';

interface RoomVisualizerProps {
  artwork: Artwork;
  selectedFraming?: FramingOption;
  isOpen: boolean;
  onClose: () => void;
}

const wallColors = [
  { name: 'Gallery White', bg: '#F8F9FA', textColor: '#1A1A1A' },
  { name: 'Warm Cream', bg: '#F4ECE1', textColor: '#2D2A26' },
  { name: 'Sage Linen', bg: '#D8DECE', textColor: '#1F2923' },
  { name: 'Midnight Charcoal', bg: '#22262B', textColor: '#F1F1F1' },
  { name: 'Terracotta Clay', bg: '#C87D65', textColor: '#FFFFFF' },
  { name: 'Imperial Navy', bg: '#1B2A4A', textColor: '#FFFFFF' },
];

export function RoomVisualizer({ artwork, selectedFraming, isOpen, onClose }: RoomVisualizerProps) {
  const [selectedWall, setSelectedWall] = useState(wallColors[1]);
  const [wallScale, setWallScale] = useState(1);

  if (!isOpen) return null;

  const originalVariant = artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0];
  const { heightCm, widthCm } = originalVariant.dimensions;

  // Compute realistic aspect ratio and relative height
  const aspectRatio = widthCm / heightCm;
  const frameBorderColor = selectedFraming?.previewColor || '#e2e8f0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[85vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-border flex items-center justify-between bg-background/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Virtual Art Preview
            </span>
            <h2 className="text-lg font-serif font-bold text-foreground">
              {artwork.title} &mdash; <span className="font-sans font-normal text-sm text-muted-foreground">{widthCm} cm &times; {heightCm} cm</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Wall color selector */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-full border border-border">
              {wallColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedWall(c)}
                  style={{ backgroundColor: c.bg }}
                  className={`w-6 h-6 rounded-full border transition transform ${
                    selectedWall.name === c.name
                      ? 'scale-115 ring-2 ring-primary ring-offset-1 border-white/50'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  title={c.name}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Scene Viewport */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden transition-colors duration-500 select-none"
          style={{ backgroundColor: selectedWall.bg }}
        >
          {/* Subtle wall texture lighting effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none" />

          {/* Wall Moldings / Floor line */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-[#d7cfc5] border-t-8 border-[#ede8e1] shadow-inner flex items-end">
            {/* Parquet wood floor mockup */}
            <div className="w-full h-24 bg-gradient-to-r from-[#9e7855] via-[#a8825f] to-[#96704d] opacity-90 border-t border-[#7e5d3d]" />
          </div>

          {/* Minimalist Designer Console / Credenza to provide physical scale reference */}
          <div className="absolute bottom-16 w-80 h-16 bg-[#2d241e] rounded-t-sm shadow-2xl flex items-center justify-center border-t border-[#4a3c32]">
            <div className="w-4 h-1 bg-[#d4af37] rounded-full opacity-80" />
            {/* Decorative ceramic vase */}
            <div className="absolute -top-12 left-10 w-7 h-12 bg-[#ece4db] rounded-t-full shadow-lg" />
            {/* Ceramic bowl */}
            <div className="absolute -top-5 right-12 w-12 h-5 bg-[#3a3a3a] rounded-b-full shadow-md" />
          </div>

          {/* Scaled Artwork Frame on Wall */}
          <div
            className="relative z-10 transition-all duration-300 flex items-center justify-center"
            style={{
              marginBottom: '9rem',
              transform: `scale(${wallScale})`,
            }}
          >
            <div
              className="relative p-2 rounded-xs shadow-2xl transition-all"
              style={{
                backgroundColor: frameBorderColor,
                boxShadow:
                  selectedFraming?.id === 'unframed'
                    ? '0 20px 45px -10px rgba(0,0,0,0.45)'
                    : '0 25px 60px -10px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.15)',
              }}
            >
              {/* White Passe-partout Matting if framed */}
              <div
                className={`p-1.5 ${
                  selectedFraming && selectedFraming.id !== 'unframed'
                    ? 'bg-[#fdfcf9] border border-black/10'
                    : ''
                }`}
              >
                <img
                  src={artwork.images[0]}
                  alt={artwork.title}
                  style={{
                    maxHeight: '380px',
                    maxWidth: '480px',
                    objectFit: 'contain',
                  }}
                  className="rounded-xs select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-3.5 px-6 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Scale calibrated to standard 9ft ceiling room height
            </span>
            <span>&bull;</span>
            <span>Wall: {selectedWall.name}</span>
            <span>&bull;</span>
            <span>Frame: {selectedFraming?.name || 'Unframed'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px]">Zoom:</span>
            <input
              type="range"
              min="0.8"
              max="1.25"
              step="0.05"
              value={wallScale}
              onChange={e => setWallScale(parseFloat(e.target.value))}
              className="w-24 accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
