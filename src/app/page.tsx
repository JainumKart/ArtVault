'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  mockArtworks,
  mockCategories,
  mockArtists,
  standardFramingOptions,
} from '@/lib/mock-data';
import { Artwork, FramingOption } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { RoomVisualizer } from '@/components/artwork/RoomVisualizer';
import {
  Sparkles,
  ArrowRight,
  Eye,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Award,
  Layers,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { addItem, openCart } = useCart();
  const { openAuthModal } = useAuth();
  const [visualizerArtwork, setVisualizerArtwork] = useState<Artwork | null>(null);

  // Filter featured artworks
  const featuredArtworks = mockArtworks.filter(a => a.featured);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background pt-12 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Sparkles className="w-4 h-4" />
                <span>India&apos;s Curated Fine Art &amp; Original Masterpieces</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                Acquire Authentic <span className="italic text-primary font-normal">Originals</span> &amp; Certified Fine Art Prints.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Connect directly with India&apos;s distinguished painters, sculptors, and sketch artists.
                Every piece is secured with a tamper-proof Digital Certificate of Authenticity,
                white-glove scheduled courier pickup, and a 7-day collector escrow return guarantee.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/artworks"
                  className="px-6 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition shadow-lg flex items-center gap-2 group"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/categories"
                  className="px-6 py-3.5 rounded-xl bg-muted border border-border text-foreground font-semibold text-sm hover:bg-muted/80 transition"
                >
                  Browse by Medium
                </Link>

                <button
                  onClick={() => openAuthModal()}
                  className="px-4 py-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition underline underline-offset-4"
                >
                  Apply as an Artist &rarr;
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-border/80">
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Verifiable Digital COA</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">₹0 Fee</p>
                  <p className="text-xs text-muted-foreground">Insured Transit over ₹15k</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">7 Days</p>
                  <p className="text-xs text-muted-foreground">Escrow Inspection Window</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Artwork */}
            <div className="lg:col-span-5 relative">
              {featuredArtworks[0] && (
                <div className="relative group">
                  {/* Decorative Backdrop Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500" />

                  <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative aspect-4/5 overflow-hidden bg-muted">
                      <img
                        src={featuredArtworks[0].images[0]}
                        alt={featuredArtworks[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/75 text-white backdrop-blur-md border border-white/20">
                          Curator’s Choice
                        </span>
                      </div>
                      <button
                        onClick={() => setVisualizerArtwork(featuredArtworks[0])}
                        className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-card/90 text-foreground text-xs font-semibold backdrop-blur-md border border-border flex items-center gap-1.5 shadow-md hover:bg-card transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        View in Your Room
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-primary font-medium">{featuredArtworks[0].medium}</p>
                          <h3 className="font-serif text-xl font-bold text-foreground mt-0.5">
                            {featuredArtworks[0].title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            by {featuredArtworks[0].artistName} &bull; {featuredArtworks[0].artistLocation}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Original Artwork</p>
                          <p className="font-serif text-xl font-bold text-foreground">
                            {formatINR(featuredArtworks[0].originalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-border/60">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          COA #{featuredArtworks[0].certificateOfAuthenticity.tokenNumber}
                        </span>
                        <Link
                          href={`/artworks/${featuredArtworks[0].id}`}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Acquire Artwork <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Curated Mediums</span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-1">Explore by Category</h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/artworks?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-xl overflow-hidden aspect-square border border-border bg-muted shadow-sm hover:shadow-md transition"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 flex flex-col justify-end text-white">
                <h4 className="font-serif font-bold text-sm leading-tight group-hover:text-amber-300 transition">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-zinc-300 mt-0.5">{cat.artworkCount} pieces</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Masterpieces Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Master Collection</span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-1">Featured Originals &amp; Prints</h2>
          </div>
          <Link
            href="/artworks"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            Browse Gallery Catalog ({mockArtworks.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArtworks.slice(0, 6).map(artwork => {
            const originalVariant = artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0];
            const printVariant = artwork.variants.find(v => v.type === 'LIMITED_PRINT');

            return (
              <div
                key={artwork.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Artwork Thumbnail Container */}
                <div className="relative aspect-4/5 overflow-hidden bg-muted">
                  <Link href={`/artworks/${artwork.id}`} className="block w-full h-full">
                    <img
                      src={artwork.images[0]}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {artwork.isOriginalAvailable && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-zinc-950 backdrop-blur-xs">
                        1-of-1 Original
                      </span>
                    )}
                    {artwork.minPrintPrice && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/85 text-zinc-100 backdrop-blur-xs border border-white/20">
                        Limited Edition
                      </span>
                    )}
                  </div>

                  {/* Room Visualizer Quick Trigger */}
                  <button
                    onClick={() => setVisualizerArtwork(artwork)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-card/90 text-foreground hover:bg-card hover:text-primary transition shadow-md backdrop-blur-md border border-border/80"
                    title="Preview on your wall"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{artwork.medium}</span>
                      <span>
                        {originalVariant.dimensions.heightCm} &times; {originalVariant.dimensions.widthCm} cm
                      </span>
                    </div>

                    <Link href={`/artworks/${artwork.id}`}>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                        {artwork.title}
                      </h3>
                    </Link>

                    <Link
                      href={`/artists/${artwork.artistId}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition inline-block mt-0.5"
                    >
                      {artwork.artistName} &bull; {artwork.artistLocation}
                    </Link>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Original from</p>
                      <p className="font-serif text-lg font-bold text-foreground">
                        {formatINR(artwork.originalPrice)}
                      </p>
                      {artwork.minPrintPrice && (
                        <p className="text-[10px] text-muted-foreground">
                          Prints from {formatINR(artwork.minPrintPrice)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addItem(artwork, originalVariant, standardFramingOptions[0]);
                          openCart();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Acquire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Originals vs. Limited Prints Explainer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Collector Education</span>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Originals vs. Certified Limited Edition Prints
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fine art collecting shouldn&apos;t be confusing. ArtVault offers both singular 1-of-1 original
                masterpieces created by the artist’s own hand, as well as museum-grade archival Giclée prints
                numbered and catalogued with equal integrity.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">1-of-1 Unique Originals</h4>
                    <p className="text-xs text-muted-foreground">
                      Only one exists in the world. Includes an exclusive artist signature and cryptographically verifiable physical &amp; digital Certificate of Authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Numbered Archival Giclée Prints</h4>
                    <p className="text-xs text-muted-foreground">
                      Printed on 310gsm German etching cotton paper with archival pigment inks rated for 100+ years lightfastness. Strictly capped editions (e.g. 50 total).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/artworks"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  Explore available editions &rarr;
                </Link>
              </div>
            </div>

            {/* Visual Comparison Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-muted/60 border border-border space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-serif font-black">
                  1/1
                </div>
                <h4 className="font-serif font-bold text-base">Original Canvas</h4>
                <p className="text-xs text-muted-foreground">
                  Belgian linen, heavy impasto strokes, artist&apos;s personal provenance.
                </p>
                <div className="pt-3 border-t border-border/80">
                  <span className="text-[11px] font-bold text-foreground">Typical: ₹35k &ndash; ₹2.5L+</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-muted/60 border border-border space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-center font-serif font-black">
                  N/50
                </div>
                <h4 className="font-serif font-bold text-base">Limited Giclée</h4>
                <p className="text-xs text-muted-foreground">
                  Museum cotton rag, hand-embossed edition seal, framed or tube shipped.
                </p>
                <div className="pt-3 border-t border-border/80">
                  <span className="text-[11px] font-bold text-foreground">Typical: ₹4.5k &ndash; ₹18k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Master Artists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Voices of the Canvas</span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-1">Featured Indian Artists</h2>
          </div>
          <Link
            href="/artists"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            Meet All Artists &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockArtists.map(artist => (
            <div
              key={artist.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={artist.avatarUrl}
                  alt={artist.displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-lg font-bold text-foreground">{artist.displayName}</h3>
                    {artist.kycStatus === 'VERIFIED' && (
                      <span title="Verified Artist KYC">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{artist.location}</p>
                  <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-foreground">{artist.rating}</span>
                    <span className="text-muted-foreground">({artist.artworkCount} listings)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {artist.bio}
              </p>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Exhibited: {artist.exhibitions[0]}
                </span>
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View Studio &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Scheduled White-Glove Logistics & Payment Flow Explainer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-foreground text-background p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Art-Grade Logistics</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Scheduled Studio Pickup. Insured Transit. RBI-Compliant Escrow.
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Standard parcel services damage delicate stretched canvas and gold leaf. We partner with specialized
              art couriers (Delhivery Fine Art &amp; BlueDart Air) for scheduled pickup directly from the artist&apos;s
              easel to your living room.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Secure Checkout</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Pay via UPI, Cards, or NetBanking. Funds are held in escrow.
                </p>
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Archival Studio Packing</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Artist packs in moisture-barrier tubes or wooden crates with verified COA slip.
                </p>
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Scheduled Pickup &amp; Payout</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Courier picks up on scheduled slot. Payout releases after 7-day inspection window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
