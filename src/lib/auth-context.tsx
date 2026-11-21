'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ArtistProfile } from '@/types';
import { mockArtists } from './mock-data';

export interface StoredAccount extends User {
  password?: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'COLLECTOR' | 'ARTIST';
  city?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'signin' | 'signup';
  authTargetRole: UserRole;
  activeArtistProfile: ArtistProfile | null;
  openAuthModal: (view?: 'signin' | 'signup', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; demoOtp: string; error?: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; demoOtp: string; error?: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'instagram') => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  setRole: (role: UserRole) => void;
}

// Pre-seeded system accounts for evaluation and realistic access control
export const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'user-admin-root',
    name: 'ArtVault Platform Curator',
    email: 'admin@artvault.in',
    password: 'AdminPassword123!',
    phone: '+91 99000 11223',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'user-artist-3',
    name: 'Meera Nambiar',
    email: 'artist@artvault.in',
    password: 'ArtistPassword123!',
    phone: '+91 98470 54321',
    role: 'ARTIST',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2023-11-20T00:00:00Z',
  },
  {
    id: 'user-collector-demo',
    name: 'Devika Sharma',
    email: 'collector@artvault.in',
    password: 'CollectorPassword123!',
    phone: '+91 98201 54321',
    role: 'COLLECTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2024-01-15T00:00:00Z',
    savedAddresses: [
      {
        id: 'addr-demo-1',
        fullName: 'Devika Sharma',
        phone: '+91 98201 54321',
        streetAddress: 'Flat 902, Lodha Bellissimo, NM Joshi Marg',
        apartment: 'Tower B, 9th Floor',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400011',
        country: 'India',
        isDefault: true,
      },
    ],
  },
];

const STORAGE_KEYS = {
  SESSION: 'artvault_active_session',
  ACCOUNTS: 'artvault_registered_accounts',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('COLLECTOR');
  const [activeArtistProfile, setActiveArtistProfile] = useState<ArtistProfile | null>(null);

  // Helper: Retrieve all stored accounts (seeded + registered)
  const getStoredAccounts = (): StoredAccount[] => {
    if (typeof window === 'undefined') return SEED_ACCOUNTS;
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(SEED_ACCOUNTS));
      return SEED_ACCOUNTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return SEED_ACCOUNTS;
    } catch {
      return SEED_ACCOUNTS;
    }
  };

  // Helper: Save accounts list
  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  };

  // Initialize session on mount
  useEffect(() => {
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (rawSession) {
      try {
        const sessionUser: User = JSON.parse(rawSession);
        setUser(sessionUser);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        setUser(null);
      }
    } else {
      // Default to logged-out state
      setUser(null);
    }

    // Ensure seed accounts exist in storage
    const existing = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(SEED_ACCOUNTS));
    }
  }, []);

  // Sync active artist profile when role changes
  useEffect(() => {
    if (user?.role === 'ARTIST') {
      const match = mockArtists.find(a => a.userId === user.id) || mockArtists[0];
      setActiveArtistProfile(match);
    } else {
      setActiveArtistProfile(null);
    }
  }, [user]);

  const openAuthModal = (view: 'signin' | 'signup' = 'signin', defaultRole: UserRole = 'COLLECTOR') => {
    setAuthModalView(view);
    setAuthTargetRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Email & Password Authentication
  const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const matched = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (matched.password && matched.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Strip password from active session user object
    const { password: _, ...sessionUser } = matched;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // User Registration (Sign Up)
  const signUp = async (params: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!params.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (params.phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please provide a valid 10-digit mobile number.' };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const newUser: StoredAccount = {
      id: `user-${Date.now()}`,
      name: params.name.trim(),
      email: cleanEmail,
      phone: params.phone.startsWith('+91') ? params.phone : `+91 ${params.phone.replace(/\D/g, '')}`,
      password: params.password,
      role: params.role, // 'COLLECTOR' | 'ARTIST'
      avatarUrl:
        params.role === 'ARTIST'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      savedAddresses: params.city
        ? [
            {
              id: `addr-${Date.now()}`,
              fullName: params.name.trim(),
              phone: params.phone,
              streetAddress: 'Studio Residence',
              city: params.city,
              state: 'India',
              postalCode: '400001',
              country: 'India',
              isDefault: true,
            },
          ]
        : [],
    };

    const updatedAccounts = [...accounts, newUser];
    saveStoredAccounts(updatedAccounts);

    // Save active session
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Phone OTP dispatch simulation
  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; demoOtp: string; error?: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '123456' });
      }, 500);
    });
  };

  // Phone OTP verification
  const verifyPhoneOtp = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid verification code. Please enter 123456.' };
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const accounts = getStoredAccounts();
    const matched = accounts.find(a => a.phone.replace(/\D/g, '').includes(cleanPhone));

    if (matched) {
      const { password: _, ...sessionUser } = matched;
      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
      closeAuthModal();
      return { success: true };
    }

    // Auto-create a collector profile for this verified phone number
    const newUser: StoredAccount = {
      id: `user-phone-${Date.now()}`,
      name: `Collector ${cleanPhone.slice(-4)}`,
      email: `collector.${cleanPhone.slice(-4)}@artvault.in`,
      phone: `+91 ${cleanPhone}`,
      role: 'COLLECTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newUser]);
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Email OTP dispatch simulation
  const sendEmailOtp = async (email: string): Promise<{ success: boolean; demoOtp: string; error?: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '654321' });
      }, 500);
    });
  };

  // Email OTP verification
  const verifyEmailOtp = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    if (otp !== '654321' && otp.length !== 6) {
      return { success: false, error: 'Invalid verification code. Please enter 654321.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();
    const matched = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (matched) {
      const { password: _, ...sessionUser } = matched;
      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
      closeAuthModal();
      return { success: true };
    }

    // Auto-create collector profile for this verified email
    const username = cleanEmail.split('@')[0];
    const newUser: StoredAccount = {
      id: `user-email-${Date.now()}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: cleanEmail,
      phone: '+91 98000 00000',
      role: 'COLLECTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: false,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newUser]);
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Social OAuth Login
  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'instagram'): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        const newUser: User = {
          id: `user-oauth-${Date.now()}`,
          name: provider === 'google' ? 'Google Collector' : provider === 'facebook' ? 'Meta Collector' : 'Instagram Art Collector',
          email: `${provider}.collector@artvault.in`,
          phone: '+91 98000 11111',
          role: 'COLLECTOR',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          isPhoneVerified: true,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
        closeAuthModal();
        resolve(true);
      }, 600);
    });
  };

  // Sign Out
  const logout = () => {
    setUser(null);
    setActiveArtistProfile(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  // Update User Profile
  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const modified: User = { ...user, ...updated };
    setUser(modified);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(modified));

    // Also update in accounts store
    const accounts = getStoredAccounts();
    const updatedAccounts = accounts.map(a => (a.id === user.id ? { ...a, ...updated } : a));
    saveStoredAccounts(updatedAccounts);
  };

  // Legacy setRole helper (maps to seeded account login for testing, but properly authenticated)
  const setRole = (newRole: UserRole) => {
    const seed = SEED_ACCOUNTS.find(a => a.role === newRole) || SEED_ACCOUNTS[0];
    const { password: _, ...sessionUser } = seed;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalView,
        authTargetRole,
        activeArtistProfile,
        openAuthModal,
        closeAuthModal,
        signInWithPassword,
        signUp,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
        loginWithOAuth,
        logout,
        updateUser,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
