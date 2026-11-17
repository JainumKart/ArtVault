'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import { ArrowUpRight, Instagram, Twitter, Facebook, Mail, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 text-foreground transition-colors duration-200">
      {/* Compact Reusable Trust Strip */}
      <div className="border-b border-border bg-muted/20 dark:bg-muted/10">
        <div className={STYLE_CLASSES.layout.pageContainer + ' py-6'}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Verifiable COA with Tamper-Proof Registry</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary dark:text-purple-400 shrink-0" />
              <span>Scheduled Courier Pickups directly from Artist Studios</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>RBI-Compliant {APP_CONFIG.financial.escrowHoldingDays}-Day Collector Escrow Protection</span>
            </div>
            <Link
              href="/trust"
              className="text-primary dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
            >
              Explore Our Trust Standards &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className={STYLE_CLASSES.layout.pageContainer + ' py-14'}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="group inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              India&apos;s premier curated art marketplace connecting discerning collectors with authentic original masterpieces and certified limited prints from visionary fine artists.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="#" className={STYLE_CLASSES.buttons.iconCircle} aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className={STYLE_CLASSES.buttons.iconCircle} aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className={STYLE_CLASSES.buttons.iconCircle} aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:curator@artvault.in" className={STYLE_CLASSES.buttons.iconCircle} aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Discover &amp; Collect</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/artworks" className="hover:text-primary transition">All Artworks</Link></li>
              <li><Link href="/artworks?type=ORIGINAL" className="hover:text-primary transition">1-of-1 Originals</Link></li>
              <li><Link href="/artworks?type=LIMITED_PRINT" className="hover:text-primary transition">Limited Edition Prints</Link></li>
              <li><Link href="/artists" className="hover:text-primary transition">Featured Artists</Link></li>
              <li><Link href="/collector-vault" className="hover:text-primary transition">Collector Vault</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">For Artists</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/sell" className="hover:text-primary transition">Apply as an Artist</Link></li>
              <li><Link href="/artist/dashboard" className="hover:text-primary flex items-center gap-1 transition">Artist Studio Portal <ArrowUpRight className="w-3.5 h-3.5" /></Link></li>
              <li><Link href="/trust#artists" className="hover:text-primary transition">Seller Standards &amp; Commission</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Trust &amp; Policies</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/trust#coa" className="hover:text-primary transition">Verifiable COA Standard</Link></li>
              <li><Link href="/trust#escrow" className="hover:text-primary transition">7-Day Escrow Protection</Link></li>
              <li><Link href="/trust#logistics" className="hover:text-primary transition">Art-Grade Logistics</Link></li>
              <li><Link href="/trust#taxes" className="hover:text-primary transition">GST &amp; Invoicing (HSN 9701)</Link></li>
              <li><a href="mailto:curator@artvault.in" className="hover:text-primary transition">Curator Advisory Desk</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} {APP_CONFIG.name} Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-foreground">Privacy Policy</span>
            <span className="cursor-pointer hover:text-foreground">Terms of Service</span>
            <span className="cursor-pointer hover:text-foreground">Artist Agreement</span>
            <span className="cursor-pointer hover:text-foreground">Escrow Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
