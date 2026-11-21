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
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const { user, role, openAuthModal, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

              {/* Show Artist Studio link ONLY if authenticated as ARTIST */}
              {role === 'ARTIST' && (
                <Link
                  href="/artist/dashboard"
                  className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/20 transition"
                >
                  <Palette className="w-3.5 h-3.5" /> Artist Studio
                </Link>
              )}

              {/* Show Admin Portal link ONLY if authenticated as ADMIN */}
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

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

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

            {/* Authenticated User Profile Dropdown vs Guest Sign In/Up */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-muted border border-border transition"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-border"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-foreground leading-none truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground capitalize leading-tight">
                      {user.role.toLowerCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2.5 border-b border-border">
                      <p className="font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                          : user.role === 'ARTIST'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {user.role === 'ADMIN' ? 'Platform Administrator' : user.role === 'ARTIST' ? 'Fine Artist' : 'Art Collector'}
                      </span>
                    </div>

                    {/* Role-Specific Navigation Links */}
                    <div className="py-1">
                      <Link
                        href="/collector-vault"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-primary dark:text-purple-400" />
                        Collector Vault &amp; COAs
                      </Link>

                      {user.role === 'ARTIST' && (
                        <Link
                          href="/artist/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted transition font-medium text-amber-700 dark:text-amber-300"
                        >
                          <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          Artist Studio &amp; Orders
                        </Link>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted transition font-medium text-purple-700 dark:text-purple-300"
                        >
                          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          Admin Command Desk
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-destructive hover:bg-destructive/10 transition flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className={STYLE_CLASSES.buttons.primary + " px-4 py-2 text-xs font-semibold"}
                >
                  Sign Up
                </button>
              </div>
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

          {user ? (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="px-1 py-1">
                <p className="text-xs font-bold text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.role}</p>
              </div>

              <Link
                href="/collector-vault"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition"
              >
                Collector Vault &amp; COAs
              </Link>

              {role === 'ARTIST' && (
                <Link
                  href="/artist/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-amber-600 dark:text-amber-400"
                >
                  Artist Studio &amp; Orders
                </Link>
              )}

              {role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-purple-600 dark:text-purple-400"
                >
                  Admin Command Desk
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-medium text-destructive"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="py-2.5 rounded-xl border border-border text-xs font-semibold text-center hover:bg-muted"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className={STYLE_CLASSES.buttons.primary + " py-2.5 text-xs text-center"}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
