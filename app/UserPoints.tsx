'use client'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UserPoints() {
  const { user } = useUser()
  const [points, setPoints] = useState<number | null>(null)

  const fetchPoints = async (userId: string) => {
    try {
      // Try to get existing points
      const { data, error } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching points:', error)
        return null
      }

      // If no record exists, create one with default points
      if (!data) {
        const { data: newData, error: createError } = await supabase
          .from('user_points')
          .insert([
            { user_id: userId, points: 500 }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating points:', createError)
          return null
        }

        return newData?.points ?? 500
      }

      return data.points
    } catch (error) {
      console.error('Error in fetchPoints:', error)
      return null
    }
  }

  const updatePoints = async (userId: string, newPoints: number) => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .update({ points: newPoints })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating points:', error)
        return null
      }

      return data.points
    } catch (error) {
      console.error('Error in updatePoints:', error)
      return null
    }
  }

  useEffect(() => {
    const loadPoints = async () => {
      if (user?.id) {
        const userPoints = await fetchPoints(user.id)
        setPoints(userPoints)
      }
    }

    if (user) {
      loadPoints()
    }
  }, [user])

  // Export functions to be used in other components
  return {
    points,
    fetchPoints,
    updatePoints,
    setPoints
  }
}

// Create a custom hook for easier use in other components
export const usePoints = () => {
  const pointsData = UserPoints()
  return pointsData
}
