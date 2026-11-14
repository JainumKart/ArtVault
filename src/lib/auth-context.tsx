'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ArtistProfile } from '@/types';
import { mockArtists } from './mock-data';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  activeArtistProfile: ArtistProfile | null;
  setRole: (role: UserRole) => void;
  openAuthModal: (defaultTab?: 'phone' | 'email' | 'social') => void;
  closeAuthModal: () => void;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; demoOtp: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<boolean>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; demoOtp: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'instagram') => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const defaultCollectorUser: User = {
  id: 'user-collector-demo',
  name: 'Devika Sharma',
  email: 'devika.collector@artvault.in',
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
};

const defaultArtistUser: User = {
  id: 'user-artist-3',
  name: 'Meera Nambiar',
  email: 'meera.artist@artvault.in',
  phone: '+91 98470 54321',
  role: 'ARTIST',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  isPhoneVerified: true,
  isEmailVerified: true,
  createdAt: '2023-11-20T00:00:00Z',
};

const defaultAdminUser: User = {
  id: 'user-admin-root',
  name: 'Platform Admin',
  email: 'admin@artvault.in',
  phone: '+91 99000 11223',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  isPhoneVerified: true,
  isEmailVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('COLLECTOR');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeArtistProfile, setActiveArtistProfile] = useState<ArtistProfile | null>(null);

  // Initialize with a collector user for smooth demo experience
  useEffect(() => {
    const savedUser = localStorage.getItem('artvault_demo_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRoleState(parsed.role || 'COLLECTOR');
      } catch {
        setUser(defaultCollectorUser);
      }
    } else {
      setUser(defaultCollectorUser);
    }
  }, []);

  useEffect(() => {
    if (role === 'ARTIST') {
      const match = mockArtists.find(a => a.id === 'artist-3') || mockArtists[0];
      setActiveArtistProfile(match);
    } else {
      setActiveArtistProfile(null);
    }
  }, [role]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    let targetUser: User;
    if (newRole === 'COLLECTOR') {
      targetUser = defaultCollectorUser;
    } else if (newRole === 'ARTIST') {
      targetUser = defaultArtistUser;
    } else {
      targetUser = defaultAdminUser;
    }
    setUser(targetUser);
    localStorage.setItem('artvault_demo_user', JSON.stringify(targetUser));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const sendPhoneOtp = async (phone: string) => {
    // Simulated SMS OTP dispatch via Fast2SMS / MSG91
    return new Promise<{ success: boolean; demoOtp: string }>(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '123456' });
      }, 600);
    });
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    if (otp === '123456' || otp.length === 6) {
      const newUser: User = {
        ...defaultCollectorUser,
        phone,
        isPhoneVerified: true,
      };
      setUser(newUser);
      setRoleState(newUser.role);
      localStorage.setItem('artvault_demo_user', JSON.stringify(newUser));
      closeAuthModal();
      return true;
    }
    return false;
  };

  const sendEmailOtp = async (email: string) => {
    return new Promise<{ success: boolean; demoOtp: string }>(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '654321' });
      }, 600);
    });
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    if (otp === '654321' || otp.length === 6) {
      const newUser: User = {
        ...defaultCollectorUser,
        email,
        isEmailVerified: true,
      };
      setUser(newUser);
      setRoleState(newUser.role);
      localStorage.setItem('artvault_demo_user', JSON.stringify(newUser));
      closeAuthModal();
      return true;
    }
    return false;
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'instagram') => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        const newUser: User = {
          ...defaultCollectorUser,
          name: provider === 'google' ? 'Google Collector' : provider === 'facebook' ? 'Meta Collector' : 'Instagram Art Lover',
          email: `${provider}.user@artvault.in`,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        };
        setUser(newUser);
        setRoleState(newUser.role);
        localStorage.setItem('artvault_demo_user', JSON.stringify(newUser));
        closeAuthModal();
        resolve(true);
      }, 700);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('artvault_demo_user');
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const modified = { ...user, ...updated };
    setUser(modified);
    localStorage.setItem('artvault_demo_user', JSON.stringify(modified));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn: !!user,
        isAuthModalOpen,
        activeArtistProfile,
        setRole,
        openAuthModal,
        closeAuthModal,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
        loginWithOAuth,
        logout,
        updateUser,
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
