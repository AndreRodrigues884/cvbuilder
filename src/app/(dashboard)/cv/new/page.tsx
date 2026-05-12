'use client'

import { useCVStore } from '@/store/cv-store'
import StepPersonal from '@/components/cv/steps/step-personal'
import StepExperience from '@/components/cv/steps/step-experience'
import StepEducation from '@/components/cv/steps/step-education'
import StepSkills from '@/components/cv/steps/step-skills'
import StepProjects from '@/components/cv/steps/step-projects'
import StepReview from '@/components/cv/steps/step-review'

const steps = [
  { number: 1, label: 'Pessoal' },
  { number: 2, label: 'Experiência' },
  { number: 3, label: 'Educação' },
  { number: 4, label: 'Skills' },
  { number: 5, label: 'Projetos' },
  { number: 6, label: 'Revisão' },
]

export default function NewCVPage() {
  const { currentStep } = useCVStore()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Criar novo CV</h1>
        <p className="text-slate-500 mt-1">Passo {currentStep} de {steps.length}</p>
      </div>

      <div className="flex items-center mb-10">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep > step.number ? 'bg-slate-900 text-white' : currentStep === step.number ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
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
        {currentStep === 1 && <StepPersonal />}
        {currentStep === 2 && <StepExperience />}
        {currentStep === 3 && <StepEducation />}
        {currentStep === 4 && <StepSkills />}
        {currentStep === 5 && <StepProjects />}
        {currentStep === 6 && <StepReview />}
      </div>
    </div>
  )
}