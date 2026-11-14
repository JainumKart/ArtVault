'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  mockArtworks,
  standardFramingOptions,
} from '@/lib/mock-data';
import { ArtworkVariant, FramingOption } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { RoomVisualizer } from '@/components/artwork/RoomVisualizer';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  Eye,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Ruler,
  Maximize2,
  Box,
} from 'lucide-react';

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const artworkId = params.id as string;
  const artwork = mockArtworks.find(a => a.id === artworkId) || mockArtworks[0];

  // Selected variant & framing
  const [selectedVariant, setSelectedVariant] = useState<ArtworkVariant>(
    artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0]
  );
  const [selectedFraming, setSelectedFraming] = useState<FramingOption>(
    standardFramingOptions[0]
  );
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Price calculation
  const currentTotalPrice = selectedVariant.price + selectedFraming.priceDelta;

  const handleAddToCart = () => {
    addItem(artwork, selectedVariant, selectedFraming);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(artwork, selectedVariant, selectedFraming);
    router.push('/checkout');
  };

  // Convert dimensions to inches for collectors
  const heightInches = (selectedVariant.dimensions.heightCm / 2.54).toFixed(1);
  const widthInches = (selectedVariant.dimensions.widthCm / 2.54).toFixed(1);

  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-8 space-y-12"}>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/artworks" className="hover:text-foreground">Artworks</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-xs">{artwork.title}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: High-Definition Artwork Image & Interactive Tools (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-card dark:bg-card/85 border border-border dark:border-purple-900/30 rounded-2xl overflow-hidden shadow-sm dark:shadow-purple-950/40">
            <div
              className={`relative aspect-4/5 overflow-hidden bg-muted cursor-zoom-in ${
                isZoomed ? 'scale-125 transition-transform duration-300' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={artwork.images[0]}
                alt={artwork.title}
                className="w-full h-full object-contain p-2"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {artwork.isOriginalAvailable && (
                  <span className={STYLE_CLASSES.badges.originalGold}>
                    1-of-1 Original
                  </span>
                )}
                {artwork.minPrintPrice && (
                  <span className={STYLE_CLASSES.badges.printPurple}>
                    Certified Prints Available
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar on Canvas */}
            <div className="p-4 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Click canvas to {isZoomed ? 'reset' : 'zoom'} details</span>
              <button
                onClick={() => setIsVisualizerOpen(true)}
                className="px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-card/80 font-semibold shadow-xs flex items-center gap-2 transition"
              >
                <Eye className="w-4 h-4 text-primary dark:text-purple-400" />
                View in Your Room (Virtual Wall Preview)
              </button>
            </div>
          </div>

          {/* Certificate of Authenticity Preview Card */}
          <div className="bg-card dark:bg-card/80 border border-border dark:border-purple-900/30 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-foreground">
                  Cryptographically Verified Certificate of Authenticity
                </h4>
                <span className={STYLE_CLASSES.badges.verifiedGreen}>
                  QR Verified
                </span>
              </div>
              <p className={STYLE_CLASSES.typography.bodySmall}>
                Includes unique tamper-proof token <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono text-foreground">{artwork.certificateOfAuthenticity.tokenNumber}</code> signed by {artwork.artistName}. A physical embossed archival slip is also packaged with the shipment.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Variants, Framing & Checkout Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Artist and Title */}
          <div>
            <Link
              href={`/artists/${artwork.artistId}`}
              className="text-xs font-bold uppercase tracking-wider text-primary dark:text-purple-400 hover:underline"
            >
              {artwork.artistName} &bull; {artwork.artistLocation}
            </Link>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
              {artwork.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {artwork.medium} &bull; Created in {artwork.year} &bull; {artwork.surface}
            </p>
          </div>

          {/* Edition / Variant Selector */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Edition Format
            </label>

            <div className="space-y-2">
              {artwork.variants.map(variant => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 shadow-xs ring-1 ring-primary dark:ring-purple-500'
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-foreground">
                          {variant.title}
                        </span>
                        {variant.type === 'ORIGINAL' && (
                          <span className={STYLE_CLASSES.badges.originalGold}>
                            Unique 1/1
                          </span>
                        )}
                        {variant.type === 'LIMITED_PRINT' && (
                          <span className={STYLE_CLASSES.badges.printPurple}>
                            {variant.editionAvailable} of {variant.editionTotal} Available
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {variant.dimensions.heightCm} &times; {variant.dimensions.widthCm} cm ({heightInches}&quot; &times; {widthInches}&quot;)
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-serif font-bold text-base text-foreground">
                        {formatINR(variant.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Framing Selection */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Custom Archival Framing
              </label>
              <span className="text-xs text-primary dark:text-purple-400 font-semibold">
                {selectedFraming.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {standardFramingOptions.map(framing => {
                const isSelected = selectedFraming.id === framing.id;
                return (
                  <button
                    key={framing.id}
                    onClick={() => setSelectedFraming(framing)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 ring-1 ring-primary dark:ring-purple-500'
                        : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: framing.previewColor }}
                      />
                      <span className="text-xs font-bold text-foreground truncate">
                        {framing.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground mt-2">
                      {framing.priceDelta === 0 ? 'Included' : `+ ${formatINR(framing.priceDelta)}`}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {selectedFraming.description}
            </p>
          </div>

          {/* Pricing & Checkout Actions */}
          <div className="bg-card dark:bg-gradient-to-br dark:from-card dark:via-purple-950/10 dark:to-blue-950/20 border border-border dark:border-purple-900/30 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Acquisition Price</p>
                <p className="font-serif text-3xl font-bold text-foreground">
                  {formatINR(currentTotalPrice)}
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Free Scheduled Pickup &amp; Transit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={STYLE_CLASSES.buttons.secondary + " py-3.5 text-sm"}
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className={STYLE_CLASSES.buttons.primary + " py-3.5 text-sm"}
              >
                Acquire Now
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-3 border-t border-border/80 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary dark:text-purple-400 shrink-0" />
                <span>Scheduled white-glove pickup from artist&apos;s studio</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{APP_CONFIG.financial.escrowHoldingDays}-Day Escrow Protection: Full refund if not satisfied</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-primary dark:text-purple-400 shrink-0" />
                <span>Packaging: {artwork.shippingInfo.packaging.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Artwork Specs Accordion */}
          <div className="border border-border rounded-2xl p-5 bg-card space-y-3">
            <h4 className="font-serif font-bold text-sm text-foreground">Artwork Specifications</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Medium:</span>
                <p className="font-semibold text-foreground">{artwork.medium}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Surface:</span>
                <p className="font-semibold text-foreground">{artwork.surface}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Style:</span>
                <p className="font-semibold text-foreground">{artwork.style}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <p className="font-semibold text-foreground">
                  {selectedVariant.dimensions.heightCm} &times; {selectedVariant.dimensions.widthCm} cm
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Creation Year:</span>
                <p className="font-semibold text-foreground">{artwork.year}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shipping Weight:</span>
                <p className="font-semibold text-foreground">{selectedVariant.weightKg} kg (insured)</p>
              </div>
            </div>
          </div>

          {/* Artist Bio Snippet */}
          <div className="border border-border rounded-2xl p-5 bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={artwork.artistAvatar}
                alt={artwork.artistName}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <h4 className="font-serif font-bold text-sm text-foreground">{artwork.artistName}</h4>
                <p className="text-xs text-muted-foreground">{artwork.artistLocation}</p>
              </div>
            </div>
            <Link
              href={`/artists/${artwork.artistId}`}
              className="text-xs font-bold text-primary dark:text-purple-400 hover:underline"
            >
              View Studio &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Room Visualizer Modal */}
      <RoomVisualizer
        artwork={artwork}
        selectedFraming={selectedFraming}
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />
    </div>
  );
}
