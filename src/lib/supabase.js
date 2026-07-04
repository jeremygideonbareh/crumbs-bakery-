import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vkicdybgaoofabgapmbw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraWNkeWJnYW9vZmFiZ2FwbWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDQ2NTEsImV4cCI6MjA5ODcyMDY1MX0.76hkqREvRpVQsjynsz0a72GsLEwOaxbWS7aqn79nwLs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
