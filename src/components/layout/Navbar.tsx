'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Palette,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  Truck,
} from 'lucide-react';

export function Navbar() {
  const { user, role, setRole, openAuthModal, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      {/* Top Banner: Scheduled White-Glove Pickup & RBI Compliant Escrow */}
      <div className="bg-primary/95 text-primary-foreground text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          Curated Fine Art Marketplace &bull; 100% Verifiable Certificates of Authenticity &bull; Scheduled White-Glove Pickups
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-serif font-black text-xl shadow-sm group-hover:scale-105 transition">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Art<span className="text-primary italic">Vault</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/artworks"
                className="text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
              >
                Explore Artworks
              </Link>
              <Link
                href="/categories"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Categories
              </Link>
              <Link
                href="/artists"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Featured Artists
              </Link>

              {role === 'ARTIST' && (
                <Link
                  href="/artist/dashboard"
                  className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/20 transition"
                >
                  <Palette className="w-3.5 h-3.5" /> Artist Studio
                </Link>
              )}

              {role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold text-xs border border-purple-500/30 flex items-center gap-1 hover:bg-purple-500/20 transition"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Persona Switcher */}
          <div className="flex items-center gap-3">
            {/* Interactive Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-muted border border-border hover:bg-muted/80 transition"
                title="Switch platform view mode"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-muted-foreground">Viewing as:</span>
                <span className="text-foreground capitalize">{role.toLowerCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      setRole('COLLECTOR');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted transition ${
                      role === 'COLLECTOR' ? 'text-primary font-bold bg-muted/40' : 'text-foreground'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    Collector / Buyer
                  </button>
                  <button
                    onClick={() => {
                      setRole('ARTIST');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted transition ${
                      role === 'ARTIST' ? 'text-primary font-bold bg-muted/40' : 'text-foreground'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-primary" />
                    Artist Studio
                  </button>
                  <button
                    onClick={() => {
                      setRole('ADMIN');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted transition ${
                      role === 'ADMIN' ? 'text-primary font-bold bg-muted/40' : 'text-foreground'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    Admin Command
                  </button>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-foreground hover:bg-muted transition"
              aria-label="View cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-3 py-2 text-foreground hover:bg-muted transition"
                    >
                      Collector Dashboard & COA Vault
                    </Link>

                    {role === 'ARTIST' && (
                      <Link
                        href="/artist/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-3 py-2 text-foreground hover:bg-muted transition font-medium text-amber-700 dark:text-amber-300"
                      >
                        Artist Studio & Orders
                      </Link>
                    )}

                    {role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-3 py-2 text-foreground hover:bg-muted transition font-medium text-purple-700 dark:text-purple-300"
                      >
                        Admin Command Center
                      </Link>
                    )}

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-destructive hover:bg-destructive/10 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90 transition shadow-xs"
              >
                Sign In / Join
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          <Link
            href="/artworks"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-foreground"
          >
            Explore Artworks
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-foreground"
          >
            Categories
          </Link>
          <Link
            href="/artists"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-foreground"
          >
            Featured Artists
          </Link>
          <Link
            href="/artist/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-amber-600"
          >
            Artist Studio & Orders
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-purple-600"
          >
            Admin Management
          </Link>
        </div>
      )}
    </header>
  );
}
