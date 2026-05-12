# CVBuilder 🚀

Plataforma full-stack de criação e otimização de CVs com inteligência artificial, destinada a pessoas em processo de procura de emprego.

## ✨ Funcionalidades

- **CV Builder** — Criação de CVs passo a passo com templates profissionais, incluindo experiência, educação, skills, línguas, projetos e certificações
- **AI Review** — Importa o teu CV (PDF ou texto) e recebe análise detalhada com score ATS, pontos fortes, fracos e sugestões de melhoria
- **Job Match** — Cola a descrição de uma vaga e a AI analisa o match com o teu CV, sugerindo adaptações sem inventar informação
- **Career Copilot** — Define o teu objetivo de carreira e recebe um plano de ação personalizado com skills, certificações e fases de desenvolvimento
- **Interview Prep** — Simulação de entrevistas com perguntas geradas por AI para a tua vaga específica e feedback imediato por resposta
- **Tracking de Candidaturas** — Regista e acompanha o estado de todas as tuas candidaturas
- **Exportar CV para PDF** — Exporta o teu CV em formato PDF profissional
- **Dashboard** — Visão geral com estatísticas reais (CVs criados, score ATS médio, candidaturas, entrevistas)

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes + Server Actions |
| Base de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| AI | Groq API (llama-3.3-70b-versatile) |
| PDF Geração | Puppeteer |
| PDF Extração | pdf2json |
| Estado global | Zustand |
| Deploy | Vercel |

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Groq](https://console.groq.com)

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USERNAME/cvbuilder.git
cd cvbuilder
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Cria um ficheiro `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Groq AI
GROQ_API_KEY=xxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar a base de dados

No painel do Supabase, vai ao **SQL Editor** e corre os scripts de criação de tabelas disponíveis em `/docs/schema.sql` (ou cria manualmente as tabelas descritas abaixo).

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser.

## 🗄️ Estrutura da Base de Dados

- `profiles` — Perfis dos utilizadores
- `cvs` — CVs criados
- `cv_experiences` — Experiências profissionais
- `cv_education` — Formação académica
- `cv_skills` — Skills
- `cv_languages` — Línguas
- `cv_projects` — Projetos pessoais
- `cv_certifications` — Certificações
- `ai_reviews` — Resultados das análises AI
- `job_matches` — Resultados dos job matches
- `career_plans` — Planos de carreira
- `interview_sessions` — Sessões de entrevista
- `interview_questions` — Perguntas e respostas de entrevista
- `job_applications` — Tracking de candidaturas

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Login e registo
│   ├── (dashboard)/     # Área autenticada
│   ├── (marketing)/     # Landing page pública
│   └── api/             # API Routes
├── components/
│   ├── cv/              # Componentes do CV Builder
│   └── layout/          # Sidebar e layout
├── lib/
│   ├── ai/              # Cliente Groq e prompts
│   ├── pdf/             # Extração e geração de PDFs
│   └── supabase/        # Clientes Supabase
├── store/               # Estado global (Zustand)
└── types/               # TypeScript types
```

## 🔑 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `GROQ_API_KEY` | Chave da API Groq |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação |

## 🚢 Deploy

O projeto está configurado para deploy no **Vercel**:

1. Faz push do código para o GitHub
2. Importa o repositório no [Vercel](https://vercel.com)
3. Adiciona as variáveis de ambiente no painel do Vercel
4. Deploy automático a cada push para `main`

## 📝 Licença

Este projeto foi desenvolvido para fins académicos e de aprendizagem.

---

Desenvolvido por **André Rodrigues** — [LinkedIn](https://linkedin.com/in/andré-rodrigues2b526a285/) · [GitHub](https://github.com/AndreRodrigues884)