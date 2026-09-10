import type { CVData } from '@/types/cv'

function formatDate(date: string | null | undefined): string | null {
  if (!date) return null
  if (date.length === 7) return `${date}-01`
  return date
}

/** Normaliza as datas (YYYY-MM → YYYY-MM-DD) dos arrays embutidos de um CVData antes de gravar no Firestore. */
export function formatCvArrays(cvData: CVData) {
  return {
    experiences: cvData.experiences.map(e => ({ ...e, start_date: formatDate(e.start_date), end_date: formatDate(e.end_date) })),
    education: cvData.education.map(e => ({ ...e, start_date: formatDate(e.start_date), end_date: formatDate(e.end_date) })),
    skills: cvData.skills,
    languages: cvData.languages,
    projects: cvData.projects.map(p => ({ ...p, start_date: formatDate(p.start_date), end_date: formatDate(p.end_date) })),
    certifications: cvData.certifications.map(c => ({ ...c, issue_date: formatDate(c.issue_date), expiry_date: formatDate(c.expiry_date) })),
  }
}
