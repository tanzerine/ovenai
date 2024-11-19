import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../../lib/supabase'

interface PointsStore {
  points: number | null
  isInitialized: boolean
  userEmail: string | null
  userName: string | null
  setPoints: (points: number | null) => void
  updatePoints: (userId: string, newPoints: number, email?: string, name?: string) => Promise<void>
  fetchPoints: (userId: string, email?: string, name?: string) => Promise<void>
  getUsernameFromEmail: (email: string) => string
}

export const usePointsStore = create<PointsStore>()(
  persist(
    (set, get) => ({
      points: null,
      isInitialized: false,
      userEmail: null,
      userName: null,
      setPoints: (points) => set({ points }),
      
      getUsernameFromEmail: (email: string) => {
        return email.split('@')[0].toLowerCase()
      },

      updatePoints: async (userId: string, newPoints: number, email?: string, name?: string) => {
        try {
          const username = get().getUsernameFromEmail(userId)
          
          const { error } = await supabase
            .from('user_points')
            .upsert({ 
              user_id: username, 
              points: newPoints,
              email: email,
              name: name,
              updated_at: new Date().toISOString()
            })
            .select()

          if (error) throw error
          
          set({ 
            points: newPoints,
            userEmail: email || get().userEmail,
            userName: name || get().userName
          })
        } catch (error) {
          console.error("Error updating points:", error)
          throw error
        }
      },

      fetchPoints: async (userId: string, email?: string, name?: string) => {
        try {
          const username = get().getUsernameFromEmail(userId)
          
          // First check if user exists
          const { data: existingUser, error: checkError } = await supabase
            .from('user_points')
            .select('points, email, name')
            .eq('user_id', username)
            .single()

          if (checkError) {
            if (checkError.code === 'PGRST116') {
              // User doesn't exist, create new user with 500 points
              console.log('Creating new user with 500 points')
              await get().updatePoints(userId, 500, email, name)
              set({ 
                points: 500, 
                isInitialized: true,
                userEmail: email || null,
                userName: name || null
              })
            } else {
              console.error("Error checking user:", checkError)
              // Don't set any default points on other errors
              return
            }
          } else if (existingUser) {
            // User exists, use their current points
            console.log('Found existing user with points:', existingUser.points)
            set({ 
              points: existingUser.points,
              isInitialized: true,
              userEmail: existingUser.email || email || null,
              userName: existingUser.name || name || null
            })
          }
        } catch (error) {
          console.error("Error fetching points:", error)
          // Don't set any default points on error
        }
      },
    }),
    {
      name: 'points-storage',
      partialize: (state) => ({ 
        points: state.points, 
        isInitialized: state.isInitialized,
        userEmail: state.userEmail,
        userName: state.userName
      })
    }
  )
)
