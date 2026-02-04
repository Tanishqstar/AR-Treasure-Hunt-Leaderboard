import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create client if variables exist to avoid crashing the build/bundle
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    console.warn('Supabase URL and Anon Key are missing. Real-time features will be disabled.');
}
