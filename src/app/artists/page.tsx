'use client';

import React from 'react';
import Link from 'next/link';
import { mockArtists, mockArtworks } from '@/lib/mock-data';
import { STYLE_CLASSES } from '@/constants';
import { CheckCircle2, Star, MapPin, Award, ArrowRight } from 'lucide-react';

export default function ArtistsPage() {
  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-10 space-y-12"}>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className={STYLE_CLASSES.typography.eyebrow}>The Creators</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Master Artists &amp; Contemporary Creators
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          ArtVault carefully vets and showcases accomplished fine artists across India.
          Connect directly with their studio, explore their exhibitions, and acquire certified originals.
        </p>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockArtists.map(artist => {
          const artistArtworks = mockArtworks.filter(a => a.artistId === artist.id);

          return (
            <div
              key={artist.id}
              className={STYLE_CLASSES.cards.interactive + " rounded-3xl overflow-hidden"}
            >
              {/* Studio Banner */}
              <div className="relative h-32 bg-muted overflow-hidden">
                <img
                  src={artist.bannerUrl}
                  alt={artist.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Profile Card Content */}
              <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between space-y-5">
                <div>
                  {/* Avatar overlapping banner */}
                  <div className="-mt-12 flex items-end justify-between mb-3">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.displayName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-md"
                    />
                    {artist.kycStatus === 'VERIFIED' && (
                      <span className={STYLE_CLASSES.badges.verifiedGreen}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified KYC
                      </span>
                    )}
                  </div>

                  {/* Name & Location */}
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary dark:group-hover:text-purple-400 transition">
                    {artist.displayName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {artist.location}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {artist.rating}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>

                  {/* Exhibitions list */}
                  <div className="mt-4 pt-3 border-t border-border space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Award className="w-3 h-3 text-primary dark:text-purple-400" /> Key Exhibitions
                    </span>
                    <p className="text-xs text-foreground font-medium truncate">
                      {artist.exhibitions[0]}
                    </p>
                  </div>
                </div>

                {/* Artist Artworks Preview Strip */}
                <div>
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {artistArtworks.length} artworks listed
                    </span>
                    <Link
                      href={`/artists/${artist.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-purple-400 hover:underline"
                    >
                      Visit Studio <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
