import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rlaxfsxmcqlsqfcxdtis.supabase.co';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsYXhmc3htY3Fsc3FmY3hkdGlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTI2MDk4NiwiZXhwIjoyMTEwODM2OTg2fQ.AHwshJl0MjkAtzAiQGL0sZ2woICoZpVUraEf7N6M3AA';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
