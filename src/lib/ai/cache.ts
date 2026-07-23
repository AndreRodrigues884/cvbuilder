import { createClient } from '@/lib/supabase/server'

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

// Função para obter uma revisão de CV em cache
export async function getCachedReview(userId: string, cvText: string) {
  const supabase = await createClient()
  const textHash = hashText(cvText.substring(0, 500))

  const { data } = await supabase
    .from('ai_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('text_hash', textHash)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data || null
}

// Função para obter um plano de carreira em cache
export async function getCachedCareerPlan(userId: string, currentPosition: string, targetRole: string) {
  const supabase = await createClient()

  const { data } = await supabase 
    .from('career_plans') 
    .select('*')
    .eq('user_id', userId)
    .eq('current_position', currentPosition || '')
    .eq('target_role', targetRole)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data || null
}