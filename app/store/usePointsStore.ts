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
        .upsert({ user_id: username, points: newPoints })
        .select()

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

      if (error) throw error
      
      set({ points: data?.points ?? 500 }) // <-- Potential issue here
    } catch (error) {
      console.error("Error fetching points:", error)
      set({ points: 500 })  // <-- And here
    }
  },
}))
