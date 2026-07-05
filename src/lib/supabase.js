import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Creates a mock Supabase client that gracefully returns empty/error results
 * for every operation. Used when env vars are missing so the app doesn't crash.
 */
function createMockClient() {
  const NOT_CONFIGURED = 'Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  const stubPromise = () => Promise.resolve({ data: null, error: new Error(NOT_CONFIGURED) })
  const chainedBuilder = () => ({
    select: () => chainedBuilder(),
    insert: () => chainedBuilder(),
    update: () => chainedBuilder(),
    delete: () => chainedBuilder(),
    eq: () => chainedBuilder(),
    order: () => chainedBuilder(),
    single: () => chainedBuilder(),
    maybeSingle: () => chainedBuilder(),
    then: (resolve) => resolve({ data: null, error: new Error(NOT_CONFIGURED) }),
    catch: () => stubPromise(),
    finally: (cb) => { cb?.(); return stubPromise() },
  })

  return {
    from: () => chainedBuilder(),
    rpc: () => stubPromise(),
    auth: {
      signInWithPassword: () => stubPromise(),
      signOut: () => stubPromise(),
      getSession: () => stubPromise(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => stubPromise(),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: () => stubPromise(),
        remove: () => stubPromise(),
      }),
    },
    functions: {
      invoke: () => stubPromise(),
    },
    channel: () => ({
      on: () => ({ subscribe: () => stubPromise() }),
      subscribe: () => stubPromise(),
      unsubscribe: () => {},
    }),
    get subscriptions() { return [] },
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '%c[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.%c\n' +
    '  • Order placement and contact form will FAIL at runtime.\n' +
    '  • Admin panel (products, orders, messages) will be EMPTY.\n' +
    '  • Set these in your .env file or GitHub Actions secrets.\n' +
    '  • The app will fall back to static product data for the public site.',
    'font-weight:bold;color:#e53e3e',
    'font-weight:normal;color:inherit'
  )
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()
