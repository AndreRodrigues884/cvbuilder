'use client'

import { useCVStore } from '@/store/cv-store'
import { Suspense, lazy, useEffect } from 'react'

const StepPersonal = lazy(() => import('@/components/cv/steps/step-personal'))
const StepExperience = lazy(() => import('@/components/cv/steps/step-experience'))
const StepEducation = lazy(() => import('@/components/cv/steps/step-education'))
const StepSkills = lazy(() => import('@/components/cv/steps/step-skills'))
const StepProjects = lazy(() => import('@/components/cv/steps/step-projects'))
const StepReviewEdit = lazy(() => import('@/components/cv/steps/step-review-edit'))

const steps = [
  { number: 1, label: 'Pessoal' },
  { number: 2, label: 'Experiência' },
  { number: 3, label: 'Educação' },
  { number: 4, label: 'Skills' },
  { number: 5, label: 'Projetos' },
  { number: 6, label: 'Revisão' },
]

export default function EditCVClient({ cvId, initialData }: { cvId: string, initialData: any }) {
  const { currentStep, updateCV, cvData, reset, setStep } = useCVStore()

  useEffect(() => {
    reset()
    setStep(1)
    const { cv, experiences, education, skills, languages, projects, certifications } = initialData

    updateCV({
      title: cv.title,
      full_name: cv.full_name || '',
      email: cv.email || '',
      phone: cv.phone || '',
      location: cv.location || '',
      linkedin_url: cv.linkedin_url || '',
      github_url: cv.github_url || '',
      portfolio_url: cv.portfolio_url || '',
      summary: cv.summary || '',
      experiences: (experiences || []).map((e: any) => ({
        id: e.id, company: e.company, job_title: e.job_title,
        location: e.location || '', start_date: e.start_date || '',
        end_date: e.end_date || '', is_current: e.is_current || false,
        description: e.description || '', achievements: e.achievements || [],
      })),
      education: (education || []).map((e: any) => ({
        id: e.id, institution: e.institution, degree: e.degree || '',
        field_of_study: e.field_of_study || '', start_date: e.start_date || '',
        end_date: e.end_date || '', is_current: e.is_current || false, grade: e.grade || '',
      })),
      skills: (skills || []).map((s: any) => ({
        id: s.id, name: s.name, level: s.level || 'intermediate', category: s.category || '',
      })),
      languages: (languages || []).map((l: any) => ({
        id: l.id, language: l.language, level: l.level || 'intermediate',
      })),
      projects: (projects || []).map((p: any) => ({
        id: p.id, name: p.name, description: p.description || '',
        technologies: p.technologies || [], url: p.url || '',
        github_url: p.github_url || '', start_date: p.start_date || '', end_date: p.end_date || '',
      })),
      certifications: (certifications || []).map((c: any) => ({
        id: c.id, name: c.name, issuer: c.issuer || '',
        issue_date: c.issue_date || '', expiry_date: c.expiry_date || '',
        credential_url: c.credential_url || '',
      })),
    })
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Editar CV</h1>
        <p className="text-slate-500 mt-1">Passo {currentStep} de {steps.length}</p>
      </div>

      <div className="flex items-center mb-10">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep > step.number ? 'bg-slate-900 text-white' : currentStep === step.number ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-1.5 whitespace-nowrap ${currentStep === step.number ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${currentStep > step.number ? 'bg-slate-900' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-slate-100 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg" />
            <div className="h-10 w-full bg-slate-100 rounded-xl mt-6" />
            <div className="h-10 w-full bg-slate-100 rounded-xl" />
          </div>
        }>
          {currentStep === 1 && <StepPersonal />}
          {currentStep === 2 && <StepExperience />}
          {currentStep === 3 && <StepEducation />}
          {currentStep === 4 && <StepSkills />}
          {currentStep === 5 && <StepProjects />}
          {currentStep === 6 && <StepReviewEdit cvId={cvId} />}
        </Suspense>
      </div>
    </div>
  )
}