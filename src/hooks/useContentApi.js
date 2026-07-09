import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/pages/admin/AdminLogin'

export function useContentApi() {
  const { password } = useAdminAuth()

  function rpc(name, params = {}) {
    return supabase.rpc(name, { admin_token: password, ...params })
  }

  return {
    sections: {
      list: () => rpc('admin_read_page_sections'),
      get: (sectionKey) =>
        supabase.rpc('public_read_page_section', { section_key: sectionKey }),
      update: (key, label, type, data) =>
        rpc('admin_upsert_page_section', {
          p_key: key,
          p_label: label,
          p_type: type,
          p_data: data,
        }),
    },
  }
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
