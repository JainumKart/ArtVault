'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, SEED_ACCOUNTS } from '@/lib/auth-context';
import {
  X,
  Smartphone,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Palette,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { STYLE_CLASSES } from '@/constants';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalView,
    authTargetRole,
    openAuthModal,
    signInWithPassword,
    signUp,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendEmailOtp,
    verifyEmailOtp,
    loginWithOAuth,
  } = useAuth();

  // Mode: 'signin' | 'signup'
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  const [signInMethod, setSignInMethod] = useState<'password' | 'phone' | 'email'>('password');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signUpRole, setSignUpRole] = useState<'COLLECTOR' | 'ARTIST'>('COLLECTOR');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCity, setSignUpCity] = useState('');

  // OTP State
  const [otpPhone, setOtpPhone] = useState('9000000003');
  const [otpEmail, setOtpEmail] = useState('kartik@artvault.in');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync modal view when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalView);
      if (authTargetRole === 'ARTIST') {
        setSignUpRole('ARTIST');
      } else {
        setSignUpRole('COLLECTOR');
      }
      setErrorMsg(null);
      setSuccessMsg(null);
      setOtpStep('input');
    }
  }, [isAuthModalOpen, authModalView, authTargetRole]);

  if (!isAuthModalOpen) return null;

  // 1. Handle Sign In with Password
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signInWithPassword(signInEmail, signInPassword);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  // 2. Handle Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signUp({
      name: signUpName,
      email: signUpEmail,
      phone: signUpPhone,
      password: signUpPassword,
      role: signUpRole,
      city: signUpCity,
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  // 3. Handle Phone OTP Dispatch
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otpPhone || otpPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    const res = await sendPhoneOtp(otpPhone);
    setIsLoading(false);
    setOtpNotice(`OTP sent successfully! Demo verification code: ${res.demoOtp}`);
    setOtpCode(res.demoOtp);
    setOtpStep('verify');
  };

  // 4. Handle Phone OTP Verification
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const res = await verifyPhoneOtp(otpPhone, otpCode);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid OTP code.');
    }
  };

  // 5. Handle Email OTP Dispatch
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otpEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    const res = await sendEmailOtp(otpEmail);
    setIsLoading(false);
    setOtpNotice(`Verification code sent! Demo code: ${res.demoOtp}`);
    setOtpCode(res.demoOtp);
    setOtpStep('verify');
  };

  // 6. Handle Email OTP Verification
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const res = await verifyEmailOtp(otpEmail, otpCode);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid code.');
    }
  };

  // Quick helper to fill test account credentials
  const fillCredentials = (role: 'ADMIN' | 'ARTIST' | 'COLLECTOR') => {
    const acc = SEED_ACCOUNTS.find(a => a.role === role);
    if (acc) {
      setSignInEmail(acc.email);
      setSignInPassword(acc.password || '');
      setSignInMethod('password');
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden bg-card border border-border dark:border-purple-900/40 rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="bg-muted/40 dark:bg-purple-950/20 p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Art<span className="text-primary dark:text-purple-400 italic">Vault</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary dark:bg-purple-500/20 dark:text-purple-300 border border-primary/20 uppercase tracking-wider">
                Authentication
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary View Switcher: Sign In vs Sign Up */}
          <div className="mt-4 grid grid-cols-2 bg-muted/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setView('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                view === 'signin'
                  ? 'bg-card text-foreground shadow-xs ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setView('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                view === 'signup'
                  ? 'bg-card text-foreground shadow-xs ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: SIGN IN                                          */}
          {/* ======================================================== */}
          {view === 'signin' && (
            <div className="space-y-4">
              {/* Sign In Method Selector */}
              <div className="flex border-b border-border pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod('password');
                    setErrorMsg(null);
                  }}
                  className={`pb-1 px-2 font-semibold transition border-b-2 -mb-2.5 ${
                    signInMethod === 'password'
                      ? 'border-primary dark:border-purple-500 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod('phone');
                    setOtpStep('input');
                    setErrorMsg(null);
                  }}
                  className={`pb-1 px-2 font-semibold transition border-b-2 -mb-2.5 ${
                    signInMethod === 'phone'
                      ? 'border-primary dark:border-purple-500 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod('email');
                    setOtpStep('input');
                    setErrorMsg(null);
                  }}
                  className={`pb-1 px-2 font-semibold transition border-b-2 -mb-2.5 ${
                    signInMethod === 'email'
                      ? 'border-primary dark:border-purple-500 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Email OTP
                </button>
              </div>

              {/* 1A: Email & Password Form */}
              {signInMethod === 'password' && (
                <form onSubmit={handlePasswordSignIn} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={e => setSignInEmail(e.target.value)}
                        placeholder="you@artvault.in"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
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
                    className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold mt-2"}
                  >
                    {isLoading ? 'Verifying Credentials...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* 1B: Mobile OTP Form */}
              {signInMethod === 'phone' && (
                <div className="pt-2">
                  {otpStep === 'input' ? (
                    <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Indian Mobile Number</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-xs text-muted-foreground bg-muted border border-r-0 border-border rounded-l-xl font-medium">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={otpPhone}
                            onChange={e => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="98201 54321"
                            className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-r-xl focus:ring-2 focus:ring-primary/20 outline-hidden font-mono"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold"}
                      >
                        {isLoading ? 'Sending SMS OTP...' : 'Send Verification OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                      {otpNotice && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400">
                          {otpNotice}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">6-Digit Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold"}
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Enter Vault'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 1C: Email OTP Form */}
              {signInMethod === 'email' && (
                <div className="pt-2">
                  {otpStep === 'input' ? (
                    <form onSubmit={handleSendEmailOtp} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Email Address</label>
                        <input
                          type="email"
                          required
                          value={otpEmail}
                          onChange={e => setOtpEmail(e.target.value)}
                          placeholder="kartik@artvault.in"
                          className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-hidden"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold"}
                      >
                        {isLoading ? 'Sending Email Code...' : 'Send Verification Code'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                      {otpNotice && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400">
                          {otpNotice}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">6-Digit Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-hidden"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold"}
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Enter Vault'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Test Credentials Fast-Fill Drawer */}
              <div className="pt-4 border-t border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Demo Evaluator Accounts (Click to Fill):
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
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: SIGN UP / REGISTRATION                           */}
          {/* ======================================================== */}
          {view === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Account Type Selector (Collector vs Artist) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setSignUpRole('COLLECTOR')}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                      signUpRole === 'COLLECTOR'
                        ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 ring-1 ring-primary dark:ring-purple-500'
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary dark:text-purple-400" />
                      <span className="text-xs font-bold text-foreground">Collector</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                      Acquire original art, digital COAs &amp; escrow protection.
                    </p>
                  </div>

                  <div
                    onClick={() => setSignUpRole('ARTIST')}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                      signUpRole === 'ARTIST'
                        ? 'border-primary dark:border-purple-500 bg-primary/5 dark:bg-purple-950/30 ring-1 ring-primary dark:ring-purple-500'
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-foreground">Artist</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                      List original paintings, prints &amp; dispatch studio pickups.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Name *</label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
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
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
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
                  value={signUpPhone}
                  onChange={e => setSignUpPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden font-mono"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Create Password (min. 6 characters) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="Create a strong password"
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
                  value={signUpCity}
                  onChange={e => setSignUpCity(e.target.value)}
                  placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={STYLE_CLASSES.buttons.primary + " w-full py-2.5 text-xs font-semibold mt-2"}
              >
                {isLoading ? 'Creating Your Account...' : `Register as ${signUpRole === 'ARTIST' ? 'Artist' : 'Collector'}`}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-muted/20 p-4 border-t border-border text-center text-xs text-muted-foreground">
          {view === 'signin' ? (
            <p>
              Don&apos;t have an ArtVault account yet?{' '}
              <button
                onClick={() => {
                  setView('signup');
                  setErrorMsg(null);
                }}
                className="font-bold text-primary dark:text-purple-400 hover:underline"
              >
                Create Account &rarr;
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => {
                  setView('signin');
                  setErrorMsg(null);
                }}
                className="font-bold text-primary dark:text-purple-400 hover:underline"
              >
                Sign In &rarr;
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
