import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. ' +
    'Supabase features (order placement, contact form) will fail at runtime. ' +
    'Set these in your .env file or Vercel environment variables.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
