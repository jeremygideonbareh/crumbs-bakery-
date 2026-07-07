import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Static fallback reviews — used when Supabase is unavailable or has no data
const STATIC_REVIEWS = [
  {
    name: 'Merry',
    text: 'My favorites from this bakery is definitely the cream puffs and THE TIRAMISU! That tiramisu is proportionate for its price and the quality is on point.',
    rating: 5,
    source: 'Google',
    when: 'Nov 2025',
  },
  {
    name: 'Ebenezer Douglas',
    text: "Love that everything was served hot, especially the snacks. Great quality and service every time.",
    rating: 5,
    source: 'Google',
    when: 'Feb 2026',
  },
  {
    name: 'Audrey LZM',
    text: 'Loved the atmosphere and the cheesecake! They offer different flavours and the place has such a warm, welcoming vibe.',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'Juri Galvan',
    text: 'They offer homemade bread. I had the carrot cake and absolutely delicious. Doesn\'t have too much sugar, just right. Also the cookies are amazing!',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'A Happy Customer',
    text: "I'm delighted with the cake I ordered for my daughter's birthday! Every aspect, from the design to the taste, was amazing.",
    rating: 5,
    source: 'Google',
    when: '2024',
  },
  {
    name: 'Dhakshanamoorthy',
    text: 'Nice desserts. I like the quality and packaging. Nice staffs and ambience too. Highly recommend.',
    rating: 5,
    source: 'Zomato',
    when: '2017',
  },
]

export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchReviews() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })

        if (!cancelled) {
          if (!error && data && data.length > 0) {
            // Map DB fields to component props
            setReviews(data.map((r) => ({
              name: r.name,
              text: r.text,
              rating: r.rating,
              source: r.source || 'Google',
              when: r.created_at
                ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                : 'Recently',
            })))
          } else {
            // Fallback to static data
            setReviews(STATIC_REVIEWS)
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setReviews(STATIC_REVIEWS)
          setLoading(false)
        }
      }
    }

    fetchReviews()
    return () => { cancelled = true }
  }, [])

  return { reviews, loading }
}
