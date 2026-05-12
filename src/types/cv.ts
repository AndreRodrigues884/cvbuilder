export interface Experience {
  id: string
  company: string
  job_title: string
  location: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  is_current: boolean
  grade: string
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
}

export interface Language {
  id: string
  language: string
  level: 'basic' | 'intermediate' | 'advanced' | 'native'
}

export interface CVData {
  title: string
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  portfolio_url: string
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
}