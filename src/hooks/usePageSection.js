import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * React hook to fetch a page section's data from Supabase.
 * Falls back to `defaults` when no data is available or fetch fails.
 *
 * @param {string} sectionKey - The section_key in page_sections table
 * @param {any} defaults - Fallback data when Supabase returns null
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export default function usePageSection(sectionKey, defaults = null) {
  const [data, setData] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: result, error: err } = await supabase
          .rpc('public_read_page_section', { section_key: sectionKey })

        if (cancelled) return

        if (err) throw err

        if (
          result &&
          typeof result === 'object' &&
          !Array.isArray(result) &&
          Object.keys(result).length > 0
        ) {
          setData(result)
        } else if (Array.isArray(result) && result.length > 0) {
          setData(result)
        } else {
          setData(defaults)
        }
      } catch (err) {
        console.warn(`[usePageSection] Failed to load "${sectionKey}":`, err.message)
        if (!cancelled) {
          setError(err)
          setData(defaults)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [sectionKey])

  return { data, loading, error }
}
