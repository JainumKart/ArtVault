/**
 * ArtVault Design System — Shared Styles, Colors & Typography Classes
 * Centralized Tailwind CSS class configurations for consistent theming across light and dark modes.
 */

export const THEME_COLORS = {
  // Brand Gold (Light mode accents & authentic fine art branding)
  gold: {
    50: '#FAF7EE',
    100: '#F5EFD7',
    200: '#EADDAE',
    300: '#DFC984',
    400: '#D3B55A',
    500: '#C59B27',
    600: '#A27C1C',
    700: '#7F5E15',
    800: '#5D4211',
    900: '#412D0B',
  },
  // Dark Theme Royal Purples (Visionary fine art & luxury platform accents)
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  // Dark Theme Indigo & Midnight Blues (Fintech security, escrow, & verified trust)
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Refined Slate & Charcoal Grays (Surfaces, cards, and borders)
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#090D16',
  },
} as const;

export const STYLE_CLASSES = {
  // Container & Layout
  layout: {
    pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    pageHeader: 'border-b border-border pb-6 space-y-1',
    sectionSpacing: 'space-y-12 pb-20',
  },

  // Typography Presets
  typography: {
    heroTitle: 'font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]',
    sectionTitle: 'font-serif text-3xl font-bold text-foreground tracking-tight',
    cardTitle: 'font-serif text-lg font-bold text-foreground group-hover:text-primary transition',
    sectionSubtitle: 'text-sm sm:text-base text-muted-foreground leading-relaxed',
    eyebrow: 'text-xs font-bold uppercase tracking-wider text-primary dark:text-purple-400',
    bodySmall: 'text-xs text-muted-foreground leading-relaxed',
  },

  // Cards & Containers (Theme-aware with Dark mode grays, purples, and blues)
  cards: {
    base: 'bg-card border border-border rounded-2xl shadow-xs transition duration-200',
    interactive: 'bg-card border border-border rounded-2xl shadow-xs hover:shadow-xl hover:border-primary/40 dark:hover:border-purple-500/40 transition-all duration-300 flex flex-col group',
    elevated: 'bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-purple-950/20',
    // Luxury Glass Card with subtle blue/purple gradient undertone in dark mode
    glass: 'bg-card/90 backdrop-blur-md border border-border/80 shadow-md dark:bg-card/75 dark:border-purple-900/30 dark:shadow-purple-950/40',
    // Highlighted card with purple/blue aura
    accentHalo: 'relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 dark:from-purple-950/30 dark:via-blue-950/20 dark:to-slate-900 border border-primary/20 dark:border-purple-800/40 rounded-2xl p-6',
  },

  // Interactive Buttons
  buttons: {
    primary: 'px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-98',
    secondary: 'px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-all border border-border flex items-center justify-center gap-1.5 active:scale-98',
    outline: 'px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98',
    ghost: 'p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all',
    iconCircle: 'w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 dark:hover:bg-purple-500/20 transition-all',
  },

  // Badges & Status Pills
  badges: {
    // 1-of-1 Original Gold Badge
    originalGold: 'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-zinc-950 shadow-xs backdrop-blur-xs',
    // Limited Print Purple Badge
    printPurple: 'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 backdrop-blur-xs',
    // Verified KYC Emerald Badge
    verifiedGreen: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    // Escrow / Security Blue Badge
    escrowBlue: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
    // Role Switcher Pill
    rolePill: 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-muted border border-border hover:bg-muted/80 transition shadow-xs',
  },

  // Data Tables (Used in Artist & Admin Dashboards)
  tables: {
    container: 'overflow-x-auto rounded-2xl border border-border bg-card shadow-xs',
    table: 'w-full text-left text-xs text-foreground',
    thead: 'bg-muted/60 text-muted-foreground uppercase tracking-wider text-[11px] font-semibold border-b border-border',
    th: 'px-4 py-3 font-semibold',
    td: 'px-4 py-3.5 border-b border-border/60 align-middle',
    row: 'hover:bg-muted/30 transition-colors',
  },

  // Form Controls & Inputs
  forms: {
    label: 'text-xs font-semibold text-foreground block mb-1',
    input: 'w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-purple-500/40 transition placeholder:text-muted-foreground',
    select: 'w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-purple-500/40 transition',
    textarea: 'w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-purple-500/40 transition placeholder:text-muted-foreground resize-none',
  },

  // Modals & Drawers
  modals: {
    backdrop: 'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300',
    container: 'relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95',
  },
} as const;
