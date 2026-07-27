import { supabase } from '@/lib/supabase'
import { useAdminApi } from './useAdminApi'

export function useContentApi() {
  return useAdminApi()
}

/**
 * Public function for front-end components to load section data.
 * Falls back to null when Supabase is unavailable.
 */
export async function fetchPageSection(sectionKey) {
  try {
    const { data, error } = await supabase
      .rpc('public_read_page_section', { section_key: sectionKey })
    if (error) throw error
    return data
  } catch (err) {
    console.warn(`[content] Failed to fetch "${sectionKey}":`, err.message)
    return null
  }
}
