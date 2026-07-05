import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '%c[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.%c\n' +
    '  • Order placement and contact form will FAIL at runtime.\n' +
    '  • Admin panel (products, orders, messages) will be EMPTY.\n' +
    '  • Set these in your .env file or Vercel environment variables.\n' +
    '  • The app will fall back to static product data for the public site.',
    'font-weight:bold;color:#e53e3e',
    'font-weight:normal;color:inherit'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
