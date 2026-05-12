import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Buscar CV e todas as secções
    const [
        { data: cv },
        { data: experiences },
        { data: education },
        { data: skills },
        { data: languages },
    ] = await Promise.all([
        supabase.from('cvs').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('cv_experiences').select('*').eq('cv_id', id).order('order_index'),
        supabase.from('cv_education').select('*').eq('cv_id', id).order('order_index'),
        supabase.from('cv_skills').select('*').eq('cv_id', id).order('order_index'),
        supabase.from('cv_languages').select('*').eq('cv_id', id).order('order_index'),
    ])

    if (!cv) return NextResponse.json({ error: 'CV not found' }, { status: 404 })

    const html = generateCVHtml({ cv, experiences, education, skills, languages })

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } })
    await browser.close()

    return new NextResponse(Buffer.from(pdf), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${cv.title || 'cv'}.pdf"`,
        },
    })
}

function generateCVHtml({ cv, experiences, education, skills, languages }: any) {
    const formatDate = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        return `${months[parseInt(month) - 1]} ${year}`
    }

    const levelLabel: Record<string, string> = {
        beginner: 'Iniciante', intermediate: 'Intermédio', advanced: 'Avançado', expert: 'Especialista',
        basic: 'Básico', native: 'Nativo',
    }

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.5; }
    h1 { font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .contact { font-size: 10px; color: #64748b; margin-bottom: 16px; }
    .contact span { margin-right: 12px; }
    .section { margin-bottom: 18px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; }
    .item { margin-bottom: 10px; }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
    .item-title { font-weight: 600; font-size: 11px; color: #0f172a; }
    .item-subtitle { font-size: 10px; color: #64748b; }
    .item-date { font-size: 10px; color: #94a3b8; white-space: nowrap; }
    .item-description { font-size: 10px; color: #374151; margin-top: 4px; line-height: 1.6; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { background: #f1f5f9; color: #334155; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
    .summary { font-size: 10px; color: #374151; line-height: 1.7; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  </style>
</head>
<body>
  <h1>${cv.full_name || ''}</h1>
  <div class="contact">
    ${cv.email ? `<span>✉ ${cv.email}</span>` : ''}
    ${cv.phone ? `<span>📞 ${cv.phone}</span>` : ''}
    ${cv.location ? `<span>📍 ${cv.location}</span>` : ''}
    ${cv.linkedin_url ? `<span>in ${cv.linkedin_url}</span>` : ''}
    ${cv.github_url ? `<span>⌥ ${cv.github_url}</span>` : ''}
    ${cv.portfolio_url ? `<span>🌐 ${cv.portfolio_url}</span>` : ''}
  </div>

  ${cv.summary ? `
  <div class="section">
    <div class="section-title">Resumo</div>
    <p class="summary">${cv.summary}</p>
  </div>` : ''}

  ${experiences && experiences.length > 0 ? `
  <div class="section">
    <div class="section-title">Experiência Profissional</div>
    ${experiences.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <div>
          <div class="item-title">${e.job_title}</div>
          <div class="item-subtitle">${e.company}${e.location ? ` · ${e.location}` : ''}</div>
        </div>
        <div class="item-date">${formatDate(e.start_date)} – ${e.is_current ? 'Presente' : formatDate(e.end_date)}</div>
      </div>
      ${e.description ? `<div class="item-description">${e.description}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${education && education.length > 0 ? `
  <div class="section">
    <div class="section-title">Educação</div>
    ${education.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <div>
          <div class="item-title">${e.degree}${e.field_of_study ? ` em ${e.field_of_study}` : ''}</div>
          <div class="item-subtitle">${e.institution}${e.grade ? ` · ${e.grade}` : ''}</div>
        </div>
        <div class="item-date">${formatDate(e.start_date)} – ${e.is_current ? 'Presente' : formatDate(e.end_date)}</div>
      </div>
    </div>`).join('')}
  </div>` : ''}

  <div class="two-col">
    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-grid">
        ${skills.map((s: any) => `<span class="skill-tag">${s.name}</span>`).join('')}
      </div>
    </div>` : ''}

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">Línguas</div>
      ${languages.map((l: any) => `
      <div class="item">
        <span class="item-title">${l.language}</span>
        <span class="item-subtitle"> · ${levelLabel[l.level] || l.level}</span>
      </div>`).join('')}
    </div>` : ''}
  </div>
</body>
</html>`
}