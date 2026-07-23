import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('job_applications')
    .select('id, company, job_title, status, applied_at, notes, job_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ applications: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data } = await supabase
    .from('job_applications')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  return NextResponse.json({ application: data })
}