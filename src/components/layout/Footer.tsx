'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Sparkles, Award, ArrowUpRight, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 text-foreground">
      {/* Guarantees Strip */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Verifiable Authenticity</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every 1-of-1 original and limited edition print includes a cryptographically signed Digital Certificate of Authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Scheduled White-Glove Pickup</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Insured art transit with scheduled pickups from artist studios, packed in archival tubes or custom crates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Curated Excellence</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Carefully vetted Indian masters and contemporary visionaries working across oil, acrylic, sketches, and mixed media.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">7-Day Escrow Protection</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Funds held securely in compliance with Indian consumer escrow norms until you inspect and approve your artwork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-serif font-black text-xl">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Art<span className="text-primary italic">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              India&apos;s premier curated art marketplace connecting discerning collectors with authentic original masterpieces and certified limited prints from visionary fine artists.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:curator@artvault.in" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Discover & Collect</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-primary transition">All Artworks</Link></li>
              <li><Link href="/explore?medium=Oil+on+Canvas" className="hover:text-primary transition">Oil on Canvas</Link></li>
              <li><Link href="/explore?medium=Charcoal+%26+Graphite" className="hover:text-primary transition">Charcoal & Sketches</Link></li>
              <li><Link href="/explore?type=ORIGINAL" className="hover:text-primary transition">1-of-1 Originals</Link></li>
              <li><Link href="/explore?type=LIMITED_PRINT" className="hover:text-primary transition">Limited Edition Prints</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition">Curated Categories</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">For Artists</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/artist/dashboard" className="hover:text-primary flex items-center gap-1 transition">Artist Studio Dashboard <ArrowUpRight className="w-3.5 h-3.5" /></Link></li>
              <li><Link href="/artist/dashboard?tab=new-listing" className="hover:text-primary transition">Submit Artwork for Curation</Link></li>
              <li><Link href="/artist/dashboard?tab=ledger" className="hover:text-primary transition">TDS & Split Settlements</Link></li>
              <li><Link href="/artist/dashboard?tab=orders" className="hover:text-primary transition">Scheduled Pickup Guidelines</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-primary flex items-center gap-1 transition">Curator Command Desk <ArrowUpRight className="w-3.5 h-3.5" /></Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Integrity & Support</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><span className="cursor-pointer hover:text-primary transition">Certificate Verification</span></li>
              <li><span className="cursor-pointer hover:text-primary transition">Packaging & Framing Standards</span></li>
              <li><span className="cursor-pointer hover:text-primary transition">GST & Invoicing (HSN 9701)</span></li>
              <li><span className="cursor-pointer hover:text-primary transition">7-Day Escrow & Inspection</span></li>
              <li><span className="cursor-pointer hover:text-primary transition">Art Advisory Desk</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} Shri Jainum Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-foreground">Privacy Policy</span>
            <span className="cursor-pointer hover:text-foreground">Terms of Service</span>
            <span className="cursor-pointer hover:text-foreground">Artist Agreement</span>
            <span className="cursor-pointer hover:text-foreground">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
