import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { cakes, cupcakes, desserts } from '@/data/products'

const STATIC_MAP = {
  cakes,
  cupcakes,
  desserts,
}

function transformProduct(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    desc: p.description,
    badge: p.badge,
    variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants ?? [],
  }
}

export function useProducts(categorySlug) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_slug', categorySlug)
          .eq('active', true)
          .order('sort_order')

        if (!cancelled) {
          if (!error && data && data.length > 0) {
            setProducts(data.map(transformProduct))
          } else {
            const fallback = STATIC_MAP[categorySlug]
            setProducts(fallback ? [...fallback] : [])
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          const fallback = STATIC_MAP[categorySlug]
          setProducts(fallback ? [...fallback] : [])
          setLoading(false)
        }
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [categorySlug])

  return { products, loading }
}
