'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  Palette,
  Truck,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Clock,
  Layers,
} from 'lucide-react';

export default function SellPage() {
  const { openAuthModal } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [medium, setMedium] = useState('Oil on Canvas');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={STYLE_CLASSES.layout.sectionSpacing}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/40 via-background to-background dark:from-purple-950/25 dark:via-blue-950/10 dark:to-background pt-16 pb-14 border-b border-border">
        <div className={STYLE_CLASSES.layout.pageContainer}>
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold">
              <Palette className="w-4 h-4" />
              <span>Artist Representation &amp; Onboarding</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              Sell Your Masterpieces to Discerning Collectors Across India
            </h1>
            <p className={STYLE_CLASSES.typography.sectionSubtitle}>
              Retain 80% of your acquisition value. We handle white-glove scheduled courier pickups from your easel, verified Certificates of Authenticity, and guaranteed escrow bank settlements.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pillars for Artists */}
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-border dark:border-purple-900/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              80% Net Payout
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transparent 20% platform commission with zero hidden cataloguing fees. Payouts are transferred automatically to your Indian bank account with complete GST and 1% TDS certificates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border dark:border-purple-900/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              Scheduled Studio Pickup
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No need to take paintings to a post office or logistics depot. Our specialized art couriers (Delhivery Fine Art &amp; BlueDart Air) arrive at your studio at your scheduled time slot.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border dark:border-purple-900/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              Verifiable Provenance
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every piece you sell receives a dual-layer Certificate of Authenticity with tamper-proof holographic QR/NFC tagging, preserving your legacy in verified collector vaults.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form & Quick Switcher */}
      <section className={STYLE_CLASSES.layout.pageContainer}>
        <div className="max-w-2xl mx-auto bg-card border border-border dark:border-purple-900/30 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Apply for Curatorial Vetting
            </h2>
            <p className="text-xs text-muted-foreground">
              Our curatorial committee reviews submissions weekly. Accepted artists receive dedicated studio management dashboards.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-foreground">Application Received</h3>
              <p className="text-xs text-muted-foreground">
                Thank you, {name || 'Artist'}. Our curatorial board will review your portfolio and reach out to {email || 'your email'} within 3 business days.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => openAuthModal('signup', 'ARTIST')}
                  className={STYLE_CLASSES.buttons.primary + " px-6 py-2.5 text-xs"}
                >
                  Create Your Artist Studio Account &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Meera Nambiar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="artist@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">City &amp; State *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Kochi, Kerala"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Primary Medium</label>
                <select
                  value={medium}
                  onChange={e => setMedium(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                >
                  <option value="Oil on Canvas">Oil on Canvas / Linen</option>
                  <option value="Acrylic & Mixed Media">Acrylic &amp; Mixed Media</option>
                  <option value="Charcoal & Sketches">Charcoal, Ink &amp; Pencil</option>
                  <option value="Watercolor on Arches Paper">Watercolors</option>
                  <option value="Indian Folk & Heritage">Indian Folk / Heritage (Tanjore, Pichwai)</option>
                  <option value="Sculpture">Sculptures (Bronze, Stone, Wood)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Portfolio / Instagram / Website Link</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://instagram.com/yourhandle or portfolio URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={STYLE_CLASSES.buttons.primary + " w-full py-3.5 text-xs font-semibold"}
                >
                  Submit Application for Vetting &rarr;
                </button>
              </div>
            </form>
          )}

          {/* Sign In Switcher */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>Already have an artist account?</span>
            <button
              onClick={() => openAuthModal('signin', 'ARTIST')}
              className="text-primary dark:text-purple-400 font-semibold hover:underline"
            >
              Sign In to Artist Studio &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
