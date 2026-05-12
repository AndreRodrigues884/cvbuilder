import { create } from 'zustand'
import { CVData, Experience, Education, Skill, Language } from '@/types/cv'


interface CVStore {
  currentStep: number
  cvData: CVData
  setStep: (step: number) => void
  updateCV: (data: Partial<CVData>) => void
  addExperience: (exp: Experience) => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  addSkill: (skill: Skill) => void
  removeSkill: (id: string) => void
  addLanguage: (lang: Language) => void
  removeLanguage: (id: string) => void
  reset: () => void
}

const initialCV: CVData = {
  title: 'O meu CV',
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
}

export const useCVStore = create<CVStore>((set) => ({
  currentStep: 1,
  cvData: initialCV,

  setStep: (step) => set({ currentStep: step }),

  updateCV: (data) => set((state) => ({
    cvData: { ...state.cvData, ...data }
  })),

  addExperience: (exp) => set((state) => ({
    cvData: { ...state.cvData, experiences: [...state.cvData.experiences, exp] }
  })),

  updateExperience: (id, exp) => set((state) => ({
    cvData: {
      ...state.cvData,
      experiences: state.cvData.experiences.map(e => e.id === id ? { ...e, ...exp } : e)
    }
  })),

  removeExperience: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      experiences: state.cvData.experiences.filter(e => e.id !== id)
    }
  })),

  addEducation: (edu) => set((state) => ({
    cvData: { ...state.cvData, education: [...state.cvData.education, edu] }
  })),

  updateEducation: (id, edu) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.map(e => e.id === id ? { ...e, ...edu } : e)
    }
  })),

  removeEducation: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.filter(e => e.id !== id)
    }
  })),

  addSkill: (skill) => set((state) => ({
    cvData: { ...state.cvData, skills: [...state.cvData.skills, skill] }
  })),

  removeSkill: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: state.cvData.skills.filter(s => s.id !== id)
    }
  })),

  addLanguage: (lang) => set((state) => ({
    cvData: { ...state.cvData, languages: [...state.cvData.languages, lang] }
  })),

  removeLanguage: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      languages: state.cvData.languages.filter(l => l.id !== id)
    }
  })),

  reset: () => set({ currentStep: 1, cvData: initialCV }),
}))