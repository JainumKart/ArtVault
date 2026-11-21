'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { STYLE_CLASSES } from '@/constants';
import { ShieldCheck, Palette, Lock, Mail, User, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { user, signUp } = useAuth();

  const [role, setRole] = useState<'COLLECTOR' | 'ARTIST'>('COLLECTOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'ARTIST') {
        router.push('/artist/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/collector-vault');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signUp({
      name,
      email,
      phone,
      password,
      role,
      city,
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-16"}>
      <div className="max-w-md mx-auto bg-card border border-border dark:border-purple-900/40 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className={STYLE_CLASSES.typography.eyebrow}>Create Your Account</span>
          <h1 className="font-serif text-3xl font-bold text-foreground">Join ArtVault</h1>
          <p className="text-xs text-muted-foreground">
            Connect with India&apos;s master artists and build your certified fine art collection.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setRole('COLLECTOR')}
                className={`p-3 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                  role === 'COLLECTOR'
                    ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 ring-1 ring-primary dark:ring-purple-500'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary dark:text-purple-400" />
                  <span className="text-xs font-bold text-foreground">Collector</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Acquire originals, prints &amp; verifiable digital COAs.
                </p>
              </div>

              <div
                onClick={() => setRole('ARTIST')}
                className={`p-3 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                  role === 'ARTIST'
                    ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 ring-1 ring-primary dark:ring-purple-500'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-foreground">Fine Artist</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Sell artwork, manage listings &amp; studio courier pickups.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Vikramaditya Rathore"
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
            />
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Mobile Number (+91) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Password (min. 6 characters) *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full px-3 pr-9 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Optional City */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">City (Optional)</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Bengaluru, Jaipur"
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={STYLE_CLASSES.buttons.primary + " w-full py-3 text-xs font-semibold mt-2"}
          >
            {isLoading ? 'Creating Your Account...' : `Register as ${role === 'ARTIST' ? 'Artist' : 'Collector'} &rarr;`}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-muted-foreground border-t border-border">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary dark:text-purple-400 hover:underline">
            Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
