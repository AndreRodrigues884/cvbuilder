import { adminDb } from '@/lib/firebase/admin'

// Gera um hash simples do texto para comparação
function hashText(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

interface CachedReview {
  id: string
  ats_score: number
  overall_feedback: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  keywords_found: string[]
  keywords_missing: string[]
}

// Função para obter uma revisão de CV em cache
export async function getCachedReview(userId: string, cvText: string): Promise<CachedReview | null> {
  const textHash = hashText(cvText.substring(0, 500))

  const snap = await adminDb
    .collection('users').doc(userId).collection('aiReviews')
    .where('text_hash', '==', textHash)
    .orderBy('created_at', 'desc')
    .limit(1)
    .get()

  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as CachedReview
}

// Função para obter um plano de carreira em cache
export async function getCachedCareerPlan(userId: string, currentPosition: string, targetRole: string) {
  const snap = await adminDb
    .collection('users').doc(userId).collection('careerPlans')
    .where('current_position', '==', currentPosition || '')
    .where('target_role', '==', targetRole)
    .orderBy('created_at', 'desc')
    .limit(1)
    .get()

  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Record<string, unknown>
}
