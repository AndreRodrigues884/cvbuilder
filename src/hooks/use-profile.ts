'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/store/profile-store'

export function useProfile() {
  const { profile, setProfile, isStale } = useProfileStore()

  useEffect(() => {
    if (!isStale()) return // usa cache se não está stale

    async function fetchProfile() {
      const res = await fetch('/api/profile')
      if (!res.ok) return
      const { profile: data } = await res.json()
      if (data) setProfile(data)
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return profile
}
