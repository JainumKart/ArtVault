'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { standardFramingOptions } from '@/lib/mock-data';
import { ArtistProfile, Artwork } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { RoomVisualizer } from '@/components/artwork/RoomVisualizer';
import { mapDbArtworkToFrontend } from '@/lib/data-mapper';
import {
  CheckCircle2,
  Star,
  MapPin,
  Award,
  ShoppingBag,
  Eye,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export default function ArtistDetailPage() {
  const params = useParams();
  const { addItem, openCart } = useCart();
  const artistId = params.id as string;
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [artistArtworks, setArtistArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualizerArtwork, setVisualizerArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    fetch(`/api/artists/${artistId}`)
      .then(res => res.json())
      .then(resData => {
        if (!resData.success || !resData.data) return;
        const profile = resData.data;
        if (!profile.artworks?.length) return;
        setArtist({
          id: profile.id,
          userId: profile.userId,
          displayName: profile.displayName,
          slug: profile.slug,
          bio: profile.bio,
          statement: profile.statement,
          avatarUrl: profile.avatarUrl || '',
          bannerUrl: profile.bannerUrl || '',
          location: profile.location,
          exhibitions: profile.exhibitions || [],
          commissionRate: profile.commissionRate,
          kycStatus: profile.kycStatus,
          totalSales: profile.totalSales,
          rating: profile.rating,
          artworkCount: profile.artworks.length,
          joinedDate: profile.createdAt,
        });
        setArtistArtworks(profile.artworks.map(mapDbArtworkToFrontend));
      })
      .catch(error => console.error('Could not fetch artist profile:', error))
      .finally(() => setIsLoading(false));
  }, [artistId]);

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading artist profile...</div>;
  }

  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-foreground">Artist profile not found</h1>
        <p className="text-sm text-muted-foreground">This artist may not have a public studio profile yet.</p>
        <Link href="/artists" className="inline-flex text-sm font-semibold text-primary hover:underline">
          Browse artists
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Studio Cover Banner */}
      <div className="relative h-64 sm:h-80 bg-muted overflow-hidden">
        <img
          src={artist.bannerUrl}
          alt={artist.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
      </div>

      {/* Artist Profile Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={artist.avatarUrl}
              alt={artist.displayName}
              className="w-24 h-24 sm:w-28 sm:size-28 rounded-2xl object-cover border-4 border-card shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {artist.displayName}
                </h1>
                {artist.kycStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Master
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {artist.location}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" /> {artist.rating} Rating
                </span>
                <span>Member since {artist.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/artworks"
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition"
            >
              Browse All Artists
            </Link>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Artist profile link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body: Bio & Artworks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Bio & Exhibitions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-foreground">Artist Biography</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {artist.bio}
            </p>
            {artist.statement && (
              <div className="p-4 rounded-xl bg-muted/40 border-l-2 border-primary space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Artist Statement
                </span>
                <p className="text-xs italic text-foreground leading-relaxed">
                  &ldquo;{artist.statement}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Exhibitions */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Exhibitions &amp; Honors
            </h3>
            <ul className="space-y-3">
              {artist.exhibitions.map((ex, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Studio Artworks (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Studio Artworks ({artistArtworks.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Direct from artist studio with Certificate of Authenticity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artistArtworks.length === 0 ? (
              <p className="sm:col-span-2 rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                This artist has not listed any artworks yet.
              </p>
            ) : artistArtworks.map(artwork => {
              const originalVariant = artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0];

              return (
                <div
                  key={artwork.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-muted">
                    <Link href={`/artworks/${artwork.id}`} className="block w-full h-full">
                      <img
                        src={artwork.images[0]}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </Link>

                    {/* Room Visualizer Quick Icon */}
                    <button
                      onClick={() => setVisualizerArtwork(artwork)}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-card/90 text-foreground hover:bg-card hover:text-primary transition shadow-md backdrop-blur-md border border-border/80"
                      title="Preview on your wall"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>{artwork.medium}</span>
                        <span>{artwork.year}</span>
                      </div>
                      <Link href={`/artworks/${artwork.id}`}>
                        <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                          {artwork.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Original Price</p>
                        <p className="font-serif text-base font-bold text-foreground">
                          {formatINR(artwork.originalPrice)}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          addItem(artwork, originalVariant, standardFramingOptions[0]);
                          openCart();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Acquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Room Visualizer Modal */}
      {visualizerArtwork && (
        <RoomVisualizer
          artwork={visualizerArtwork}
          selectedFraming={standardFramingOptions[0]}
          isOpen={!!visualizerArtwork}
          onClose={() => setVisualizerArtwork(null)}
        />
      )}
    </div>
  );
}
