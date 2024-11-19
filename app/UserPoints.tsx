'use client'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export function UserPoints() {
  const { user } = useUser()
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      // Create Supabase client
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      const fetchPoints = async () => {
        // Try to get existing points
        const { data, error } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single()

        if (error || !data) {
          // If user doesn't exist, create new entry with 500 points
          const { data: newUser, error: insertError } = await supabase
            .from('user_points')
            .insert([
              { user_id: user.id, points: 500 }
            ])
            .select('points')
            .single()

          if (!insertError && newUser) {
            setPoints(newUser.points)
          }
        } else {
          // Use existing points
          setPoints(data.points)
        }
      }

      fetchPoints()
    }
  }, [user])

  if (points === null) {
    return null // or a loading spinner
  }

  return (
    <span className="text-sm font-semibold leading-6 text-gray-900">
      {points} points
    </span>
  )
}
