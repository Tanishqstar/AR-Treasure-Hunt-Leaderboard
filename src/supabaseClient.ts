import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const createSupabaseClient = () => {
    // Check if both exist and url starts with http
    if (
        supabaseUrl &&
        typeof supabaseUrl === 'string' &&
        supabaseUrl.trim().startsWith('http') &&
        supabaseAnonKey
    ) {
        try {
            return createClient(supabaseUrl, supabaseAnonKey);
        } catch (e) {
            console.error('Supabase initialization failed:', e);
            return null;
        }
    }
    return null;
}

export const supabase = createSupabaseClient();

if (!supabase) {
    console.warn('Supabase configuration missing or invalid. Check your environment variables.');
}
