// usePointsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../../lib/supabase'

interface PointsStore {
  points: number | null
  isInitialized: boolean
  setPoints: (points: number | null) => void
  updatePoints: (userEmail: string, newPoints: number) => Promise<void>
  fetchPoints: (userEmail: string) => Promise<void>
  getUsernameFromEmail: (email: string) => string
}

export const usePointsStore = create<PointsStore>()(
  persist(
    (set, get) => ({
      points: null,
      isInitialized: false,
      setPoints: (points) => set({ points }),
      
      getUsernameFromEmail: (email: string) => {
        return email.split('@')[0].toLowerCase()
      },

      updatePoints: async (userEmail: string, newPoints: number) => {
        try {
          const username = get().getUsernameFromEmail(userEmail)
          
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
          // If points are already initialized, don't fetch again
          if (get().isInitialized && get().points !== null) {
            return
          }

          const username = get().getUsernameFromEmail(userEmail)
          
          const { data, error } = await supabase
            .from('user_points')
            .select('points')
            .eq('user_id', username)
            .single()

          if (error) {
            // Only set default points if user doesn't exist in database
            if (error.code === 'PGRST116') {
              await get().updatePoints(userEmail, 500) // Set initial points for new user
              set({ points: 500, isInitialized: true })
            } else {
              throw error
            }
          } else {
            set({ points: data.points, isInitialized: true })
          }
        } catch (error) {
          console.error("Error fetching points:", error)
          // Don't set default points on error, maintain current state
        }
      },
    }),
    {
      name: 'points-storage',
      partialize: (state) => ({ points: state.points, isInitialized: state.isInitialized })
    }
  )
)
