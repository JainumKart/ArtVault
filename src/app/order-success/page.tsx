'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  Box,
  QrCode,
  Calendar,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'AV-894210';
  const dummyArtworkTitle = 'Ephemeral Monsoon over Banaras';
  const dummyArtistName = 'Aarav Mukherjee';
  const qrHash = `COA-ART-${orderId}-X99`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Settlement Confirmed &bull; RBI Escrow Active
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Acquisition Successful!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Your payment has been received and held in escrow. Order <strong>#{orderId}</strong> has been transmitted to the artist&apos;s studio for archival packing.
        </p>
      </div>

      {/* Scheduled Pickup & Fulfillment Timeline */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              White-Glove Fulfillment &amp; Scheduled Courier Pickup
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Carrier: Delhivery Fine Art Express &bull; Airway Bill (AWB): DEL-ART-9928194
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Pickup Scheduled
          </span>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> 1. Confirmed
            </div>
            <p className="text-xs font-semibold text-foreground">Payment in Escrow</p>
            <p className="text-[11px] text-muted-foreground">Today &bull; Razorpay Route</p>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
              <Box className="w-4 h-4 animate-bounce" /> 2. Archival Packing
            </div>
            <p className="text-xs font-semibold text-foreground">Studio Packaging</p>
            <p className="text-[11px] text-muted-foreground">Artist wrapping in PVC tube</p>
          </div>

          <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-1.5 opacity-80">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold">
              <Truck className="w-4 h-4" /> 3. Scheduled Pickup
            </div>
            <p className="text-xs font-semibold text-foreground">Studio Courier Pickup</p>
            <p className="text-[11px] text-muted-foreground">Slot: Tomorrow, 2 PM - 5 PM</p>
          </div>

          <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-1.5 opacity-80">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold">
              <ShieldCheck className="w-4 h-4" /> 4. Delivery &amp; Inspection
            </div>
            <p className="text-xs font-semibold text-foreground">7-Day Escrow Approval</p>
            <p className="text-[11px] text-muted-foreground">Doorstep unboxing check</p>
          </div>
        </div>
      </div>

      {/* Verifiable Digital Certificate of Authenticity (COA) Preview */}
      <div className="bg-card dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/20 border-2 border-primary/30 dark:border-purple-600/40 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Certificate Watermark / Header */}
        <div className="border-b-2 border-primary/20 dark:border-purple-600/30 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary dark:text-purple-400">
              Official Provenance Document
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Certificate of Authenticity
            </h2>
            <p className="text-xs text-muted-foreground">
              Issued under the authority of ArtVault Provenance Registry &bull; India
            </p>
          </div>

          <div className="w-16 h-16 rounded-xl bg-muted border border-border flex flex-col items-center justify-center p-1 text-center shrink-0">
            <QrCode className="w-10 h-10 text-foreground" />
            <span className="text-[8px] font-mono font-bold text-muted-foreground">VERIFY</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block text-[11px]">Artwork Title:</span>
              <p className="font-serif font-bold text-base text-foreground">{dummyArtworkTitle}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Artist:</span>
              <p className="font-semibold text-foreground">{dummyArtistName} (Bengaluru, Karnataka)</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Medium &amp; Surface:</span>
              <p className="font-semibold text-foreground">Oil on Belgian Linen Canvas</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block text-[11px]">Edition Classification:</span>
              <p className="font-bold text-amber-700 dark:text-amber-300">Unique 1-of-1 Original Masterpiece</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Cryptographic QR Token:</span>
              <p className="font-mono text-foreground font-bold bg-muted px-2 py-1 rounded w-fit">
                {qrHash}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Registry Issuance Date:</span>
              <p className="font-semibold text-foreground">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Signatures and Actions */}
        <div className="pt-6 border-t-2 border-primary/20 dark:border-purple-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground">
              A stamped physical copy with artist&apos;s seal is packaged in your tube.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className={STYLE_CLASSES.buttons.outline}
            >
              <Printer className="w-3.5 h-3.5" /> Print Certificate
            </button>
            <button
              onClick={() => alert('Certificate PDF successfully downloaded!')}
              className={STYLE_CLASSES.buttons.primary}
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Return to Gallery Button */}
      <div className="text-center pt-4">
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary dark:text-purple-400 hover:underline"
        >
          Explore More Artworks in Gallery &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground">Loading your acquisition confirmation &amp; COA...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
