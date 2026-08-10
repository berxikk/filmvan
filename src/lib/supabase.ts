import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bvoqeeijrlcgdmsxkvub.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_1aIg8pMBXs9iuvzr8nkkTg_qNIAbw20';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase ortam değişkenleri eksik! Lütfen .env dosyasını kontrol edin.');
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
