'use client';

import React from 'react';
import Link from 'next/link';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  ShieldCheck,
  Truck,
  Lock,
  FileCheck,
  CheckCircle2,
  Award,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Receipt,
  Scale,
  Clock,
} from 'lucide-react';

export default function TrustPage() {
  return (
    <div className={STYLE_CLASSES.layout.sectionSpacing}>
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-muted/40 via-background to-background dark:from-purple-950/20 dark:via-blue-950/10 dark:to-background pt-16 pb-14 border-b border-border">
        <div className={STYLE_CLASSES.layout.pageContainer}>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Integrity &amp; Collector Protection</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              Trust, Provenance &amp; Authenticity
            </h1>
            <p className={STYLE_CLASSES.typography.sectionSubtitle}>
              Acquiring fine art requires total confidence. ArtVault operates under rigorous Indian legal, financial, and curatorial standards so collectors and artists transact with complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Verifiable Certificate of Authenticity (COA) */}
      <section id="coa" className={STYLE_CLASSES.layout.pageContainer}>
        <div className="bg-card border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className={STYLE_CLASSES.typography.eyebrow}>Pillar 1: Provenance</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Dual-Layer Certificate of Authenticity
                </h2>
              </div>
            </div>
            <span className={STYLE_CLASSES.badges.verifiedGreen}>
              100% Guaranteed Genuine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Physical Archival Certificate
              </h3>
              <p>
                Every original canvas and certified limited print ships with a physical Certificate of Authenticity printed on 300gsm deckle-edge German cotton rag. It features:
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hand-counter-signed signature by the primary artist in archival acid-free ink.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Embossed metallic ArtVault curatorial seal with micro-engraved serial indentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tamper-evident holographic serial seal attached to the reverse of the canvas / frame.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary dark:text-purple-400" />
                Permanent Digital Vault Registry
              </h3>
              <p>
                In addition to the physical paper slip, each piece is registered on the ArtVault ledger with a unique cryptographic Token ID (e.g. <code>AV-COA-2024-0891</code>).
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant NFC / QR code verification via smartphone camera without installing any apps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Automatic transfer of digital ownership into your private Collector Vault upon delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Permanent archival provenance for future estate, secondary appraisal, or insured transit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Escrow Protection */}
      <section id="escrow" className={STYLE_CLASSES.layout.pageContainer}>
        <div className="bg-card border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <span className={STYLE_CLASSES.typography.eyebrow}>Pillar 2: Buyer Safety</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  RBI-Compliant {APP_CONFIG.financial.escrowHoldingDays}-Day Escrow
                </h2>
              </div>
            </div>
            <span className={STYLE_CLASSES.badges.originalGold}>
              Zero Buyer Risk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-foreground">Payment Secured in Escrow</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you acquire an artwork, funds are held securely in a nodal escrow account regulated under Reserve Bank of India consumer payment guidelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-foreground">In-Person Inspection Window</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You have {APP_CONFIG.financial.escrowHoldingDays} full calendar days from white-glove doorstep delivery to hang the artwork, inspect canvas condition, and verify COA details.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-foreground">Approval &amp; Artist Settlement</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Funds are disbursed to the artist&apos;s verified bank account only after you approve or after the inspection period expires without dispute. If dissatisfied, initiate a hassle-free return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Art-Grade Logistics & Packaging */}
      <section id="logistics" className={STYLE_CLASSES.layout.pageContainer}>
        <div className="bg-card border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <span className={STYLE_CLASSES.typography.eyebrow}>Pillar 3: Transit Logistics</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Scheduled Studio Pickup &amp; Packaging
                </h2>
              </div>
            </div>
            <span className={STYLE_CLASSES.badges.printPurple}>
              Delhivery Air &amp; BlueDart Apex
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground">Packaging Standards</h3>
              <p>
                Standard courier parcels are unsafe for fine art. All ArtVault orders must adhere to one of three laboratory-tested museum packing specifications:
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="font-bold text-foreground">Heavy-Duty PVC Archival Tube</span>
                  <p className="mt-0.5">For unframed canvas and works on paper. 3mm thick wall, acid-free glassine interleaving, moisture-sealed endcaps.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="font-bold text-foreground">Multi-Ply Reinforced Flat Box</span>
                  <p className="mt-0.5">Double-walled 5-ply corrugated board with high-density EPE edge protectors and puncture barriers.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="font-bold text-foreground">Custom Fitted Wooden Crate</span>
                  <p className="mt-0.5">Mandatory for stretched canvases exceeding 100cm and high-value originals. Plywood exterior with internal shock dampening.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground">Full In-Transit Insurance</h3>
              <p>
                Every shipment is 100% insured against loss, transit impact, humidity, or puncture from the moment our courier scans the package at the artist&apos;s studio to final hand-delivery.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Scheduled Slot Verification
                </h4>
                <p>
                  Artists choose a 3-hour pickup window. Couriers arrive with manifest paperwork, security tags, and barcode seals before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GST & Invoicing Tax Compliance */}
      <section id="taxes" className={STYLE_CLASSES.layout.pageContainer}>
        <div className="bg-card border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className={STYLE_CLASSES.typography.eyebrow}>Pillar 4: Regulatory Transparency</span>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                GST &amp; Statutory Tax Compliance (HSN 9701)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1.5">
              <span className="font-bold text-foreground">HSN Code 9701 (12% GST)</span>
              <p>Original paintings, drawings, and pastels executed entirely by hand are taxed under HSN 9701 with clear GST tax invoices for corporate or private expense credit.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1.5">
              <span className="font-bold text-foreground">Section 194-O TDS Compliance</span>
              <p>In accordance with Indian Income Tax Act regulations, ArtVault deducts 1% statutory TDS on marketplace e-commerce sales and remits directly with Form 16A certificates.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1.5">
              <span className="font-bold text-foreground">Transparent Fee Breakdown</span>
              <p>Artists receive 80% net settlement. Platform fee is fixed at 20%, covering white-glove logistics coordination, archival escrow holding, insurance, and marketing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Experience Confident Art Collecting
          </h3>
          <p className="text-xs text-muted-foreground">
            Explore curated original masterpieces and limited edition prints backed by complete institutional protection.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              href="/artworks"
              className={STYLE_CLASSES.buttons.primary + " px-6 py-3 text-xs"}
            >
              Explore Collection &rarr;
            </Link>
            <Link
              href="/sell"
              className={STYLE_CLASSES.buttons.secondary + " px-6 py-3 text-xs"}
            >
              Apply as an Artist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
