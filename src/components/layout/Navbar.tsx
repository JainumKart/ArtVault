'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { STYLE_CLASSES, NAV_LINKS, APP_CONFIG } from '@/constants';
import {
  ShoppingBag,
  User as UserIcon,
  Palette,
  Shield,
  Sparkles,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const { user, role, setRole, openAuthModal, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Banner: Scheduled White-Glove Pickup & Escrow Notice */}
      <div className="bg-primary/95 text-primary-foreground dark:bg-purple-900/90 dark:text-purple-100 text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2 transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-purple-300" />
        <span>
          Curated Fine Art Marketplace &bull; 100% Verifiable Certificates of Authenticity &bull; Scheduled White-Glove Pickups
        </span>
      </div>

      <div className={STYLE_CLASSES.layout.pageContainer}>
        <div className="flex items-center justify-between h-18">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group focus:outline-hidden">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}

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

          {/* Right Action Icons, Theme Switcher & Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Interactive Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`hidden lg:flex ${STYLE_CLASSES.badges.rolePill}`}
                title="Switch platform test role"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-muted-foreground">Viewing:</span>
                <span className="text-foreground capitalize font-semibold">{role.toLowerCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
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
              className="relative p-2 rounded-xl text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
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
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 dark:hover:ring-purple-500/40 transition"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
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
                      Collector Dashboard &amp; COA Vault
                    </Link>

                    {role === 'ARTIST' && (
                      <Link
                        href="/artist/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-3 py-2 text-foreground hover:bg-muted transition font-medium text-amber-700 dark:text-amber-300"
                      >
                        Artist Studio &amp; Orders
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
                className={STYLE_CLASSES.buttons.primary}
              >
                Sign In / Join
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground">Appearance</span>
            <ThemeToggle showLabel />
          </div>

          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/artist/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-amber-600 dark:text-amber-400"
          >
            Artist Studio &amp; Orders
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-purple-600 dark:text-purple-400"
          >
            Admin Management
          </Link>
        </div>
      )}
    </header>
  );
}
