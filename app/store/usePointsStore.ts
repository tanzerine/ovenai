// /store/usePointsStore.ts

import { create } from 'zustand'
import { supabase } from '../../lib/supabase'

interface PointsStore {
  points: number | null
  setPoints: (points: number | null) => void
  updatePoints: (userId: string, newPoints: number) => Promise<void>
  fetchPoints: (userId: string) => Promise<void>
}

export const usePointsStore = create<PointsStore>((set) => ({
  points: null,
  setPoints: (points) => set({ points }),
  
  updatePoints: async (userId: string, newPoints: number) => {
    try {
      const { error } = await supabase
        .from('user_points')
        .upsert({ user_id: userId, points: newPoints })
        .select()

      if (error) throw error
      
      set({ points: newPoints })
    } catch (error) {
      console.error("Error updating points:", error)
      throw error
    }
  },

  fetchPoints: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      
      set({ points: data?.points ?? 200 })
    } catch (error) {
      console.error("Error fetching points:", error)
      set({ points: 200 })
    }
  },
}))