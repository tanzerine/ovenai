import { create } from 'zustand'
import { supabase } from '../../lib/supabase'

interface PointsStore {
  points: number | null
  setPoints: (points: number | null) => void
  updatePoints: (userEmail: string, newPoints: number) => Promise<void>
  fetchPoints: (userEmail: string) => Promise<void>
  getUsernameFromEmail: (email: string) => string
}

export const usePointsStore = create<PointsStore>((set) => ({
  points: null,
  setPoints: (points) => set({ points }),
  
  getUsernameFromEmail: (email: string) => {
    return email.split('@')[0].toLowerCase()
  },

  updatePoints: async (userEmail: string, newPoints: number) => {
    try {
      const username = usePointsStore.getState().getUsernameFromEmail(userEmail)
      
      const { error } = await supabase
        .from('user_points')
        .update({ points: newPoints })
        .eq('user_id', username)

      if (error) throw error
      
      set({ points: newPoints })
    } catch (error) {
      console.error("Error updating points:", error)
      throw error
    }
  },

  fetchPoints: async (userEmail: string) => {
    try {
      const username = usePointsStore.getState().getUsernameFromEmail(userEmail)
      
      const { data, error } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', username)
        .single()

      if (error) {
        // If no record found, create a new one with 500 points
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('user_points')
            .insert([{ user_id: username, points: 500 }])
            .select('points')
            .single()

          if (insertError) throw insertError
          set({ points: newData.points })
          return
        }
        throw error
      }
      
      // If data exists, use the points value
      set({ points: data.points })
    } catch (error) {
      console.error("Error fetching points:", error)
      // Don't set default points on error
      throw error
    }
  },
}))
