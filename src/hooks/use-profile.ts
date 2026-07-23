'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProfileStore } from '@/store/profile-store'

export function useProfile() {
  const { profile, setProfile, isStale } = useProfileStore()

  useEffect(() => {
    if (!isStale()) return // usa cache se não está stale

    async function fetchProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data)
    }

    fetchProfile()
  }, [])

  return profile
}