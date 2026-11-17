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
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
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
    <div className={STYLE_CLASSES.layout.sectionSpacing}>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background dark:from-purple-950/20 dark:via-blue-950/10 dark:to-background pt-12 pb-20 border-b border-border">
        {/* Subtle decorative purple/blue ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className={STYLE_CLASSES.layout.pageContainer}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-purple-500/10 border border-primary/20 dark:border-purple-500/30 text-xs font-semibold text-primary dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-primary dark:text-purple-400" />
                <span>India&apos;s Curated Fine Art &amp; Original Masterpieces</span>
              </div>

              <h1 className={STYLE_CLASSES.typography.heroTitle}>
                Acquire Authentic <span className="italic text-primary dark:text-purple-400 font-normal">Originals</span> &amp; Certified Fine Art Prints.
              </h1>

              <p className={STYLE_CLASSES.typography.sectionSubtitle}>
                Connect directly with India&apos;s distinguished painters, sculptors, and sketch artists.
                Every piece is secured with a tamper-proof Digital Certificate of Authenticity,
                white-glove scheduled courier pickup, and a {APP_CONFIG.financial.escrowHoldingDays}-day collector escrow return guarantee.
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
                  <p className={STYLE_CLASSES.typography.bodySmall}>Verifiable Digital COA</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">₹0 Fee</p>
                  <p className={STYLE_CLASSES.typography.bodySmall}>Insured Transit &gt; ₹15k</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">{APP_CONFIG.financial.escrowHoldingDays} Days</p>
                  <p className={STYLE_CLASSES.typography.bodySmall}>Escrow Inspection Window</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Artwork */}
            <div className="lg:col-span-5 relative">
              {featuredArtworks[0] && (
                <div className="relative group">
                  {/* Decorative Backdrop Glow (Purple-Blue in Dark Mode) */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 dark:from-purple-600/30 dark:via-blue-600/25 dark:to-indigo-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-85 transition duration-500" />

                  <div className="relative bg-card border border-border dark:border-purple-900/40 rounded-2xl overflow-hidden shadow-2xl dark:shadow-purple-950/50">
                    <div className="relative aspect-4/5 overflow-hidden bg-muted">
                      <img
                        src={featuredArtworks[0].images[0]}
                        alt={featuredArtworks[0].title}
                        loading="eager"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/75 dark:bg-purple-950/80 text-white backdrop-blur-md border border-white/20 dark:border-purple-500/30">
                          Curator’s Choice
                        </span>
                      </div>
                      <button
                        onClick={() => setVisualizerArtwork(featuredArtworks[0])}
                        className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-card/90 text-foreground text-xs font-semibold backdrop-blur-md border border-border flex items-center gap-1.5 shadow-md hover:bg-card transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary dark:text-purple-400" />
                        View in Your Room
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-primary dark:text-purple-400 font-medium">{featuredArtworks[0].medium}</p>
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
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          COA #{featuredArtworks[0].certificateOfAuthenticity.tokenNumber}
                        </span>
                        <Link
                          href={`/artworks/${featuredArtworks[0].id}`}
                          className="text-xs font-bold text-primary dark:text-purple-400 hover:underline flex items-center gap-1"
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
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className={STYLE_CLASSES.typography.eyebrow}>Curated Mediums</span>
            <h2 className={STYLE_CLASSES.typography.sectionTitle}>Explore by Category</h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-primary dark:text-purple-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mockCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/artworks?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-xl overflow-hidden aspect-square border border-border bg-muted shadow-xs hover:shadow-lg dark:hover:border-purple-500/40 transition"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 flex flex-col justify-end text-white">
                <h4 className="font-serif font-bold text-sm leading-tight group-hover:text-amber-300 dark:group-hover:text-purple-300 transition">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-zinc-300 mt-0.5">{cat.artworkCount} pieces</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Masterpieces Grid */}
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className={STYLE_CLASSES.typography.eyebrow}>Master Collection</span>
            <h2 className={STYLE_CLASSES.typography.sectionTitle}>Featured Originals &amp; Prints</h2>
          </div>
          <Link
            href="/artworks"
            className="text-sm font-semibold text-primary dark:text-purple-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            Browse Gallery Catalog ({mockArtworks.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArtworks.slice(0, 6).map(artwork => {
            const originalVariant = artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0];

            return (
              <div
                key={artwork.id}
                className={STYLE_CLASSES.cards.interactive}
              >
                {/* Artwork Thumbnail Container */}
                <div className="relative aspect-4/5 overflow-hidden bg-muted">
                  <Link href={`/artworks/${artwork.id}`} className="block w-full h-full">
                    <img
                      src={artwork.images[0]}
                      alt={artwork.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {artwork.isOriginalAvailable && (
                      <span className={STYLE_CLASSES.badges.originalGold}>
                        1-of-1 Original
                      </span>
                    )}
                    {artwork.minPrintPrice && (
                      <span className={STYLE_CLASSES.badges.printPurple}>
                        Limited Edition
                      </span>
                    )}
                  </div>

                  {/* Room Visualizer Quick Trigger */}
                  <button
                    onClick={() => setVisualizerArtwork(artwork)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-card/90 text-foreground hover:bg-card hover:text-primary dark:hover:text-purple-400 transition shadow-md backdrop-blur-md border border-border/80"
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
                      <h3 className={STYLE_CLASSES.typography.cardTitle + " line-clamp-1"}>
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
                        className={STYLE_CLASSES.buttons.primary}
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
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="bg-card dark:bg-gradient-to-br dark:from-card dark:via-purple-950/15 dark:to-blue-950/20 border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className={STYLE_CLASSES.typography.eyebrow}>Collector Education</span>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Originals vs. Certified Limited Edition Prints
              </h2>
              <p className={STYLE_CLASSES.typography.sectionSubtitle}>
                Fine art collecting shouldn&apos;t be confusing. ArtVault offers both singular 1-of-1 original
                masterpieces created by the artist’s own hand, as well as museum-grade archival Giclée prints
                numbered and catalogued with equal integrity.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">1-of-1 Unique Originals</h4>
                    <p className={STYLE_CLASSES.typography.bodySmall}>
                      Only one exists in the world. Includes an exclusive artist signature and cryptographically verifiable physical &amp; digital Certificate of Authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Numbered Archival Giclée Prints</h4>
                    <p className={STYLE_CLASSES.typography.bodySmall}>
                      Printed on 310gsm German etching cotton paper with archival pigment inks rated for 100+ years lightfastness. Strictly capped editions (e.g. 50 total).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/artworks"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary dark:text-purple-400 hover:underline"
                >
                  Explore available editions &rarr;
                </Link>
              </div>
            </div>

            {/* Visual Comparison Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-muted/60 dark:bg-slate-900/60 border border-border dark:border-purple-900/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-serif font-black">
                  1/1
                </div>
                <h4 className="font-serif font-bold text-base text-foreground">Original Canvas</h4>
                <p className={STYLE_CLASSES.typography.bodySmall}>
                  Belgian linen, heavy impasto strokes, artist&apos;s personal provenance.
                </p>
                <div className="pt-3 border-t border-border/80">
                  <span className="text-[11px] font-bold text-foreground">Typical: ₹35k &ndash; ₹2.5L+</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-muted/60 dark:bg-slate-900/60 border border-border dark:border-purple-900/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-center font-serif font-black">
                  N/50
                </div>
                <h4 className="font-serif font-bold text-base text-foreground">Limited Giclée</h4>
                <p className={STYLE_CLASSES.typography.bodySmall}>
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
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className={STYLE_CLASSES.typography.eyebrow}>Voices of the Canvas</span>
            <h2 className={STYLE_CLASSES.typography.sectionTitle}>Featured Indian Artists</h2>
          </div>
          <Link
            href="/artists"
            className="text-sm font-semibold text-primary dark:text-purple-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            Meet All Artists &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockArtists.map(artist => (
            <div
              key={artist.id}
              className={STYLE_CLASSES.cards.interactive + " p-6 justify-between space-y-4"}
            >
              <div className="flex items-center gap-4">
                <img
                  src={artist.avatarUrl}
                  alt={artist.displayName}
                  loading="lazy"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 dark:border-purple-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-lg font-bold text-foreground">{artist.displayName}</h3>
                    {artist.kycStatus === 'VERIFIED' && (
                      <span title="Verified Artist KYC">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                  className="text-xs font-bold text-primary dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  View Studio &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Scheduled White-Glove Logistics & Payment Flow Explainer */}
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="rounded-3xl bg-foreground text-background dark:bg-slate-900/90 dark:border dark:border-purple-900/40 dark:shadow-2xl dark:shadow-purple-950/30 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle gradient aura */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-purple-600/10 to-blue-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <span className={STYLE_CLASSES.typography.eyebrow}>Art-Grade Logistics</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Scheduled Studio Pickup. Insured Transit. RBI-Compliant Escrow.
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Standard parcel services damage delicate stretched canvas and gold leaf. We partner with specialized
              art couriers (Delhivery Fine Art &amp; BlueDart Air) for scheduled pickup directly from the artist&apos;s
              easel to your living room.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="border border-white/10 dark:border-purple-500/20 rounded-xl p-4 bg-white/5 dark:bg-purple-950/20 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 dark:bg-purple-500/30 text-primary dark:text-purple-300 flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Secure Checkout</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Pay via UPI, Cards, or NetBanking. Funds are held in escrow.
                </p>
              </div>

              <div className="border border-white/10 dark:border-purple-500/20 rounded-xl p-4 bg-white/5 dark:bg-purple-950/20 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 dark:bg-purple-500/30 text-primary dark:text-purple-300 flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Archival Studio Packing</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Artist packs in moisture-barrier tubes or wooden crates with verified COA slip.
                </p>
              </div>

              <div className="border border-white/10 dark:border-purple-500/20 rounded-xl p-4 bg-white/5 dark:bg-purple-950/20 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-primary/20 dark:bg-purple-500/30 text-primary dark:text-purple-300 flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Scheduled Pickup &amp; Payout</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Courier picks up on scheduled slot. Payout releases after {APP_CONFIG.financial.escrowHoldingDays}-day inspection window.
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
