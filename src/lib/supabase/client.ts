import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rlaxfsxmcqlsqfcxdtis.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsYXhmc3htY3Fsc3FmY3hkdGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNjA5ODYsImV4cCI6MjExMDgzNjk4Nn0.f1DGXwm477_DyFRUUX7F42vjO_l4HuxqZSdOIQcid6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
