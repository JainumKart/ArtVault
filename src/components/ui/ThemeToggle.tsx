'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 border border-transparent hover:border-border flex items-center gap-2 group ${className}`}
      title={isDark ? 'Switch to Light Ivory Theme' : 'Switch to Dark Slate, Purple & Blue Theme'}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 group-hover:rotate-45 transition-transform duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
