'use client'

import { useState } from 'react'
import { useCVStore, } from '@/store/cv-store'
import type { Project, Certification } from '@/types/cv'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  technologies: [],
  url: '',
  github_url: '',
  start_date: '',
  end_date: '',
})

const emptyCert = (): Certification => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_url: '',
})

export default function StepProjects() {
  const { cvData, addProject, updateProject, removeProject, addCertification, updateCertification, removeCertification, setStep } = useCVStore()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [expandedCert, setExpandedCert] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<Project | null>(null)
  const [newCert, setNewCert] = useState<Certification | null>(null)
  const [techInput, setTechInput] = useState('')

  function handleAddProject() {
    const p = emptyProject()
    setNewProject(p)
    setExpandedProject(p.id)
  }

  function handleSaveProject() {
    if (!newProject) return
    addProject(newProject)
    setNewProject(null)
    setExpandedProject(null)
  }

  function handleAddCert() {
    const c = emptyCert()
    setNewCert(c)
    setExpandedCert(c.id)
  }

  function handleSaveCert() {
    if (!newCert) return
    addCertification(newCert)
    setNewCert(null)
    setExpandedCert(null)
  }

  function addTech(projectId: string, isNew: boolean) {
    if (!techInput.trim()) return
    if (isNew && newProject) {
      setNewProject(p => p ? { ...p, technologies: [...p.technologies, techInput.trim()] } : p)
    } else {
      const proj = cvData.projects.find(p => p.id === projectId)
      if (proj) updateProject(projectId, { technologies: [...proj.technologies, techInput.trim()] })
    }
    setTechInput('')
  }

  function removeTech(projectId: string, tech: string, isNew: boolean) {
    if (isNew && newProject) {
      setNewProject(p => p ? { ...p, technologies: p.technologies.filter(t => t !== tech) } : p)
    } else {
      const proj = cvData.projects.find(p => p.id === projectId)
      if (proj) updateProject(projectId, { technologies: proj.technologies.filter(t => t !== tech) })
    }
  }

  const allProjects = [...cvData.projects, ...(newProject ? [newProject] : [])]
  const allCerts = [...cvData.certifications, ...(newCert ? [newCert] : [])]

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Projetos & Certificações</h2>
      <p className="text-sm text-slate-500 mb-6">Destaca os teus projetos pessoais e certificações obtidas</p>

      {/* Projetos */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Projetos pessoais</h3>
        <div className="space-y-3 mb-3">
          {allProjects.map((proj) => {
            const isNew = newProject?.id === proj.id
            const isExpanded = expandedProject === proj.id
            const data = isNew ? newProject! : proj

            return (
              <div key={proj.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedProject(isExpanded ? null : proj.id)}
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{data.name || 'Novo projeto'}</p>
                    {data.technologies.length > 0 && (
                      <p className="text-xs text-slate-500">{data.technologies.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isNew && (
                      <button onClick={e => { e.stopPropagation(); removeProject(proj.id) }} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    )}
                    {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nome do projeto</label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={e => isNew ? setNewProject(p => p ? { ...p, name: e.target.value } : p) : updateProject(proj.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="Ex: CVBuilder"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">URL</label>
                        <input
                          type="url"
                          value={data.url}
                          onChange={e => isNew ? setNewProject(p => p ? { ...p, url: e.target.value } : p) : updateProject(proj.id, { url: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">GitHub</label>
                        <input
                          type="url"
                          value={data.github_url}
                          onChange={e => isNew ? setNewProject(p => p ? { ...p, github_url: e.target.value } : p) : updateProject(proj.id, { github_url: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Descrição</label>
                        <textarea
                          value={data.description}
                          onChange={e => isNew ? setNewProject(p => p ? { ...p, description: e.target.value } : p) : updateProject(proj.id, { description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                          placeholder="Breve descrição do projeto..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Tecnologias</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTech(proj.id, isNew)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Ex: React, Node.js..."
                          />
                          <button
                            onClick={() => addTech(proj.id, isNew)}
                            className="bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-700"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {data.technologies.map(tech => (
                            <span key={tech} className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                              {tech}
                              <button onClick={() => removeTech(proj.id, tech, isNew)}><X size={11} /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {isNew && (
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setNewProject(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
                        <button
                          onClick={handleSaveProject}
                          disabled={!data.name}
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button
          onClick={handleAddProject}
          disabled={!!newProject}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-xl px-4 py-3 w-full justify-center hover:border-slate-400 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />Adicionar projeto
        </button>
      </div>

      {/* Certificações */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Certificações</h3>
        <div className="space-y-3 mb-3">
          {allCerts.map((cert) => {
            const isNew = newCert?.id === cert.id
            const isExpanded = expandedCert === cert.id
            const data = isNew ? newCert! : cert

            return (
              <div key={cert.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedCert(isExpanded ? null : cert.id)}
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{data.name || 'Nova certificação'}</p>
                    <p className="text-xs text-slate-500">{data.issuer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isNew && (
                      <button onClick={e => { e.stopPropagation(); removeCertification(cert.id) }} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    )}
                    {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nome da certificação</label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={e => isNew ? setNewCert(c => c ? { ...c, name: e.target.value } : c) : updateCertification(cert.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="Ex: AWS Certified Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Entidade emissora</label>
                        <input
                          type="text"
                          value={data.issuer}
                          onChange={e => isNew ? setNewCert(c => c ? { ...c, issuer: e.target.value } : c) : updateCertification(cert.id, { issuer: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="Ex: Amazon Web Services"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Data de emissão</label>
                        <input
                          type="month"
                          value={data.issue_date}
                          onChange={e => isNew ? setNewCert(c => c ? { ...c, issue_date: e.target.value } : c) : updateCertification(cert.id, { issue_date: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">URL da credencial</label>
                        <input
                          type="url"
                          value={data.credential_url}
                          onChange={e => isNew ? setNewCert(c => c ? { ...c, credential_url: e.target.value } : c) : updateCertification(cert.id, { credential_url: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    {isNew && (
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setNewCert(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
                        <button
                          onClick={handleSaveCert}
                          disabled={!data.name}
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button
          onClick={handleAddCert}
          disabled={!!newCert}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-xl px-4 py-3 w-full justify-center hover:border-slate-400 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />Adicionar certificação
        </button>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(4)} className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900">← Anterior</button>
        <button onClick={() => setStep(6)} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
          Próximo →
        </button>
      </div>
    </div>
  )
}