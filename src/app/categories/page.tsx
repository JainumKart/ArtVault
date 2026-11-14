'use client';

import React from 'react';
import Link from 'next/link';
import { mockCategories, mockArtworks } from '@/lib/mock-data';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Mediums &amp; Disciplines</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Curated Fine Art Categories
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          From classical oil paintings on Belgian linen to raw figurative charcoal drawings and 24K gold leaf Tanjore heritage, explore authentic artworks organized by traditional fine art mediums.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCategories.map(category => {
          // Find artworks in this category
          const matchingArtworks = mockArtworks.filter(
            a => a.categoryId === category.id
          );

          return (
            <div
              key={category.id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Category Cover */}
              <div className="relative aspect-16/9 overflow-hidden bg-muted">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      {category.artworkCount} Artworks Catalogued
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Category Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {category.description}
                </p>

                {/* Artwork Previews Strip */}
                {matchingArtworks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Featured in this medium
                    </span>
                    <div className="flex items-center gap-2">
                      {matchingArtworks.slice(0, 3).map(art => (
                        <Link
                          key={art.id}
                          href={`/artworks/${art.id}`}
                          className="w-14 h-14 rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary transition shrink-0"
                          title={art.title}
                        >
                          <img
                            src={art.images[0]}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      ))}
                      {matchingArtworks.length > 3 && (
                        <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                          +{matchingArtworks.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Explore Link */}
                <div className="pt-3 border-t border-border">
                  <Link
                    href={`/artworks?medium=${encodeURIComponent(category.name.includes('Oil') ? 'Oil on Canvas' : category.name.includes('Acrylic') ? 'Acrylic on Canvas' : category.name.includes('Charcoal') ? 'Charcoal & Graphite' : '')}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline group-hover:translate-x-1 transition"
                  >
                    Browse all {category.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
