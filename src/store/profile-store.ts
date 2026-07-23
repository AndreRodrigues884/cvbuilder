import { ProfileStore } from '@/types/profile'
import { create } from 'zustand'


export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  lastFetch: 0,

  setProfile: (profile) => set({ profile, lastFetch: Date.now() }),

  clearProfile: () => set({ profile: null, lastFetch: 0 }),

  isStale: () => {
    const { lastFetch } = get()
    if (!lastFetch) return true
    return Date.now() - lastFetch > 10 * 60 * 1000 // 10 minutos
  },
}))