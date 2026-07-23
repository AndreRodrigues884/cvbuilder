export interface Profile {
  id: string
  email: string
  full_name: string
  current_job_title: string
  target_job_title: string
  years_of_experience: number | null
  plan: string
}

export interface ProfileStore {
  profile: Profile | null
  lastFetch: number
  setProfile: (profile: Profile) => void
  clearProfile: () => void
  isStale: () => boolean
}