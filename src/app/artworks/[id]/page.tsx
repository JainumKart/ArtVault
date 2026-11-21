'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  mockArtworks,
  standardFramingOptions,
} from '@/lib/mock-data';
import { Artwork, ArtworkVariant, FramingOption } from '@/types';
import { formatINR } from '@/lib/utils';
import { mapDbArtworkToFrontend } from '@/lib/data-mapper';
import { useCart } from '@/lib/cart-context';
import { RoomVisualizer } from '@/components/artwork/RoomVisualizer';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  Eye,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Ruler,
  Maximize2,
  Box,
  Layers,
  Award,
  CheckCircle2,
  Database,
} from 'lucide-react';

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const artworkId = params.id as string;
  const initialArtwork = mockArtworks.find(a => a.id === artworkId || a.slug === artworkId) || mockArtworks[0];
  const [artwork, setArtwork] = useState<Artwork>(initialArtwork);
  const [isLiveRecord, setIsLiveRecord] = useState(false);

  // Selected variant & framing
  const [selectedVariant, setSelectedVariant] = useState<ArtworkVariant>(
    initialArtwork.variants.find(v => v.type === 'ORIGINAL') || initialArtwork.variants[0]
  );
  const [selectedFraming, setSelectedFraming] = useState<FramingOption>(
    standardFramingOptions[0]
  );
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch live artwork details from Supabase if available
  useEffect(() => {
    if (!artworkId) return;
    fetch(`/api/artworks/${artworkId}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const mapped = mapDbArtworkToFrontend(resData.data);
          setArtwork(mapped);
          setIsLiveRecord(true);
          const orig = mapped.variants.find(v => v.type === 'ORIGINAL') || mapped.variants[0];
          setSelectedVariant(orig);
        }
      })
      .catch(err => {
        console.warn('Fallback to local mock artwork:', err);
      });
  }, [artworkId]);

  // Accordion state for below-the-fold details
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    specs: true,
    coa: true,
    framing: false,
    shipping: false,
    artist: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Convert selected dimensions to inches
  const selHeightInches = (selectedVariant.dimensions.heightCm / 2.54).toFixed(1);
  const selWidthInches = (selectedVariant.dimensions.widthCm / 2.54).toFixed(1);

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

      {/* ABOVE THE FOLD: Primary Presentation & Conversion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Artwork Display & Interactive Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-card dark:bg-card/85 border border-border dark:border-purple-900/30 rounded-2xl overflow-hidden shadow-sm dark:shadow-purple-950/40">
            <div
              className={`relative aspect-4/5 overflow-hidden bg-muted cursor-zoom-in ${
                isZoomed ? 'scale-125 transition-transform duration-300' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              title="Click to zoom high resolution details"
            >
              <img
                src={artwork.images[0]}
                alt={artwork.title}
                className="w-full h-full object-contain p-2"
                loading="eager"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
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

            {/* Visualizer Trigger Bar */}
            <div className="p-3.5 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Click artwork to {isZoomed ? 'reset' : 'zoom'} fine details
              </span>
              <button
                onClick={() => setIsVisualizerOpen(true)}
                className="px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted/80 font-semibold shadow-xs flex items-center gap-2 transition"
              >
                <Eye className="w-4 h-4 text-primary dark:text-purple-400" />
                View in Your Room (Virtual Wall Preview)
              </button>
            </div>
          </div>

          {/* Compact Trust Assurance Strip Above the Fold */}
          <div className="bg-muted/30 dark:bg-slate-900/40 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Physical Embossed &amp; Digital COA included</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary dark:text-purple-400 shrink-0" />
              <span>Scheduled Courier Pickup from Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{APP_CONFIG.financial.escrowHoldingDays}-Day Escrow Inspection Window</span>
            </div>
          </div>
        </div>

        {/* Right: Specifications, Selection & Acquisition (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Artist Identity */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-purple-400 mb-1">
              <span>{artwork.medium}</span>
              <span>&bull;</span>
              <span>{artwork.year}</span>
              <span>&bull;</span>
              <span>{artwork.style}</span>
              {isLiveRecord && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 ml-auto">
                  <Database className="w-3 h-3" /> Live Supabase
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {artwork.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <img
                src={artwork.artistAvatar}
                alt={artwork.artistName}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
              <Link
                href={`/artists/${artwork.artistId}`}
                className="text-sm font-semibold text-foreground hover:text-primary dark:hover:text-purple-400 transition"
              >
                {artwork.artistName}
              </Link>
              <span className="text-xs text-muted-foreground">&bull; {artwork.artistLocation}</span>
            </div>
          </div>

          {/* Edition / Variant Selector with Dynamic Inch Calculation */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Edition Format
              </label>
              <span className="text-xs text-muted-foreground">
                {selectedVariant.type === 'ORIGINAL' ? 'Unique Masterpiece' : 'Archival Giclée'}
              </span>
            </div>

            <div className="space-y-2.5">
              {artwork.variants.map(variant => {
                const isSelected = selectedVariant.id === variant.id;
                // Accurate dynamic inches calculation per variant
                const vHeightInches = (variant.dimensions.heightCm / 2.54).toFixed(1);
                const vWidthInches = (variant.dimensions.widthCm / 2.54).toFixed(1);

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
                      <p className="text-xs text-muted-foreground mt-1">
                        {variant.dimensions.heightCm} &times; {variant.dimensions.widthCm} cm ({vHeightInches}&quot; &times; {vWidthInches}&quot;)
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

          {/* Archival Framing Selector */}
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

          {/* Pricing & Acquisition CTAs */}
          <div className="bg-card dark:bg-gradient-to-br dark:from-card dark:via-purple-950/10 dark:to-blue-950/20 border border-border dark:border-purple-900/30 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Acquisition Price</p>
                <p className="font-serif text-3xl font-bold text-foreground">
                  {formatINR(currentTotalPrice)}
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Free Scheduled Pickup &amp; Insured Transit
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
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD: Organized Collapsible Accordions */}
      <div className="pt-8 border-t border-border space-y-4 max-w-4xl mx-auto">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
          Artwork Details &amp; Authenticity Provenance
        </h3>

        {/* 1. Artwork Specifications */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => toggleAccordion('specs')}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:bg-purple-500/15 dark:text-purple-300 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">Artwork Specifications</h4>
                <p className="text-xs text-muted-foreground">Medium, surface, dimensions, and physical traits</p>
              </div>
            </div>
            {openAccordions.specs ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {openAccordions.specs && (
            <div className="p-5 pt-0 border-t border-border/60">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Medium</span>
                  <p className="font-semibold text-foreground mt-0.5">{artwork.medium}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface</span>
                  <p className="font-semibold text-foreground mt-0.5">{artwork.surface}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dimensions</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {selectedVariant.dimensions.heightCm} &times; {selectedVariant.dimensions.widthCm} cm ({selHeightInches}&quot; &times; {selWidthInches}&quot;)
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Creation Year</span>
                  <p className="font-semibold text-foreground mt-0.5">{artwork.year}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Style / Movement</span>
                  <p className="font-semibold text-foreground mt-0.5">{artwork.style}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Signature</span>
                  <p className="font-semibold text-foreground mt-0.5">Hand-signed by artist on front &amp; verso</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight (Unframed)</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedVariant.weightKg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Format</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedVariant.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Packaging Standard</span>
                  <p className="font-semibold text-foreground mt-0.5 capitalize">{artwork.shippingInfo.packaging.replace(/_/g, ' ').toLowerCase()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Certificate of Authenticity & Provenance */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => toggleAccordion('coa')}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">Certificate of Authenticity &amp; Provenance</h4>
                <p className="text-xs text-muted-foreground">Tamper-proof registry token &amp; embossed physical archival seal</p>
              </div>
            </div>
            {openAccordions.coa ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {openAccordions.coa && (
            <div className="p-5 pt-0 border-t border-border/60 space-y-3">
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40">
                <div>
                  <span className="text-xs text-muted-foreground">Digital Token Registry ID:</span>
                  <p className="font-mono font-bold text-sm text-foreground mt-0.5">
                    {artwork.certificateOfAuthenticity.tokenNumber}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Issuer: ArtVault Curatorial Board &bull; Date: {new Date(artwork.certificateOfAuthenticity.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={STYLE_CLASSES.badges.verifiedGreen}>
                  Cryptographically Verified
                </span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Physical certificate printed on 300gsm deckle-edge archival cotton rag with raised metallic watermark seal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tamper-evident QR and NFC tag adhered to the back of the artwork for instantaneous mobile verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Permanent registry on ArtVault collector ledger transfers automatically to your Collector Vault upon acquisition.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* 3. Custom Framing Options */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => toggleAccordion('framing')}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">Archival Framing &amp; Glazing Standards</h4>
                <p className="text-xs text-muted-foreground">Conservation mounting, UV-filtering acrylic, and solid wood mouldings</p>
              </div>
            </div>
            {openAccordions.framing ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {openAccordions.framing && (
            <div className="p-5 pt-0 border-t border-border/60 space-y-3 pt-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                Every framed artwork is assembled in professional conservation workshops using 99% UV-blocking Tru-Vue acrylic glazing to prevent pigment fading over decades. 
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-border bg-muted/20">
                  <h5 className="font-bold text-foreground">Acid-Free Matting</h5>
                  <p className="text-[11px] mt-1">100% alpha-cellulose core museum matboards prevent chemical degradation and acid migration.</p>
                </div>
                <div className="p-3 rounded-xl border border-border bg-muted/20">
                  <h5 className="font-bold text-foreground">Solid Natural Timber</h5>
                  <p className="text-[11px] mt-1">Sustainably harvested natural oak and plantation teak, sealed against humidity and borers.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Delivery, Transit & Escrow Policy */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">Scheduled Studio Pickup &amp; 7-Day Escrow</h4>
                <p className="text-xs text-muted-foreground">White-glove art transit and RBI-compliant buyer protection</p>
              </div>
            </div>
            {openAccordions.shipping ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {openAccordions.shipping && (
            <div className="p-5 pt-0 border-t border-border/60 space-y-3 pt-4 text-xs text-muted-foreground leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border bg-muted/20">
                  <h5 className="font-bold text-foreground">Scheduled Studio Pickup</h5>
                  <p className="text-[11px] mt-1">
                    Specialized art logistics couriers (Delhivery Fine Art / BlueDart Air) pick up directly from the artist&apos;s studio within 2 business days.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-border bg-muted/20">
                  <h5 className="font-bold text-foreground">{APP_CONFIG.financial.escrowHoldingDays}-Day Escrow Return Period</h5>
                  <p className="text-[11px] mt-1">
                    Your payment remains securely in platform escrow until you receive, inspect, and approve the artwork in person. If not completely delighted, return for a 100% refund.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Artist Biography */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => toggleAccordion('artist')}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={artwork.artistAvatar}
                alt={artwork.artistName}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">About the Artist &bull; {artwork.artistName}</h4>
                <p className="text-xs text-muted-foreground">{artwork.artistLocation}</p>
              </div>
            </div>
            {openAccordions.artist ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {openAccordions.artist && (
            <div className="p-5 pt-0 border-t border-border/60 space-y-4 pt-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {artwork.artistName} is a distinguished contemporary Indian visual artist recognized for evocative exploration of medium and texture. Based in {artwork.artistLocation}, their work has been exhibited across prominent national galleries and acquired by private institutions across India and internationally.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <span className="text-xs text-muted-foreground">Certified KYC Verified Artist</span>
                <Link
                  href={`/artists/${artwork.artistId}`}
                  className="text-xs font-bold text-primary dark:text-purple-400 hover:underline"
                >
                  Visit Full Studio Portfolio &rarr;
                </Link>
              </div>
            </div>
          )}
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
