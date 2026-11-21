'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, SEED_ACCOUNTS } from '@/lib/auth-context';
import { STYLE_CLASSES } from '@/constants';
import { Mail, Lock, ShieldCheck, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { user, signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (redirectUrl && redirectUrl !== '/') {
        router.push(redirectUrl);
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'ARTIST') {
        router.push('/artist/dashboard');
      } else {
        router.push('/collector-vault');
      }
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signInWithPassword(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  const fillCredentials = (role: 'ADMIN' | 'ARTIST' | 'COLLECTOR') => {
    const acc = SEED_ACCOUNTS.find(a => a.role === role);
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password || '');
      setErrorMsg(null);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card border border-border dark:border-purple-900/40 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className={STYLE_CLASSES.typography.eyebrow}>Secure Portal</span>
        <h1 className="font-serif text-3xl font-bold text-foreground">Sign In to ArtVault</h1>
        <p className="text-xs text-muted-foreground">
          Access your fine art acquisitions, digital certificates, or artist studio.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
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

        <button
          type="submit"
          disabled={isLoading}
          className={STYLE_CLASSES.buttons.primary + " w-full py-3 text-xs font-semibold"}
        >
          {isLoading ? 'Authenticating...' : 'Sign In &rarr;'}
        </button>
      </form>

      {/* Demo Test Accounts Fast Fill */}
      <div className="pt-4 border-t border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 text-center">
          Demo Accounts for Evaluation (Click to Fill):
        </span>
        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => fillCredentials('ADMIN')}
            className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-500/20 transition truncate"
          >
            Admin Desk
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('ARTIST')}
            className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/20 transition truncate"
          >
            Artist Studio
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('COLLECTOR')}
            className="p-1.5 rounded-lg border border-border bg-muted/40 text-foreground font-semibold hover:bg-muted transition truncate"
          >
            Collector
          </button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-muted-foreground border-t border-border">
        Don&apos;t have an ArtVault account yet?{' '}
        <Link href="/signup" className="font-bold text-primary dark:text-purple-400 hover:underline">
          Register Account &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-16"}>
      <Suspense fallback={<div className="text-center py-20 text-xs text-muted-foreground">Loading authentication portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
