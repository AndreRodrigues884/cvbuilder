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
| Frontend | Next.js 16 (App Router) + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes |
| Base de dados | Firebase (Firestore) |
| Autenticação | Firebase Auth |
| AI | Groq API (llama-3.3-70b-versatile) |
| PDF Geração | Puppeteer |
| PDF Extração | pdf2json |
| Estado global | Zustand |
| Deploy | Vercel |

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Conta no [Firebase](https://firebase.google.com)
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
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxx

# Firebase Admin (server, secreto)
FIREBASE_PROJECT_ID=xxxx
FIREBASE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Groq AI
GROQ_API_KEY=xxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar o Firebase

No [Firebase Console](https://console.firebase.google.com):

1. Cria um projeto novo.
2. **Authentication** → Sign-in method → ativa **Email/Password**.
3. **Firestore Database** → cria a base de dados (modo Native).
4. **Regras** → cola o conteúdo de `firestore.rules` deste repo.
5. **Project Settings** → General → "Your apps" → regista uma Web App para obteres os 6 valores `NEXT_PUBLIC_FIREBASE_*`.
6. **Project Settings** → Service Accounts → Generate new private key → obtém os 3 valores `FIREBASE_*` (admin).

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser.

## 🗄️ Estrutura da Base de Dados (Firestore)

Todas as coleções vivem sob `users/{uid}/...` — o próprio caminho garante que cada utilizador só acede aos seus dados.

- `users/{uid}` — Perfil do utilizador
- `users/{uid}/cvs/{cvId}` — CVs criados, com `experiences`, `education`, `skills`, `languages`, `projects` e `certifications` embutidos como arrays
- `users/{uid}/aiReviews/{id}` — Resultados das análises AI
- `users/{uid}/jobMatches/{id}` — Resultados dos job matches
- `users/{uid}/careerPlans/{id}` — Planos de carreira
- `users/{uid}/interviewSessions/{id}` — Sessões de entrevista, com `questions` embutido
- `users/{uid}/jobApplications/{id}` — Tracking de candidaturas
- `users/{uid}/rateLimits/{endpoint}` — Contadores de rate limit por endpoint AI

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
│   └── firebase/        # Clientes Firebase (client, admin, getCurrentUser)
├── store/               # Estado global (Zustand)
└── types/               # TypeScript types
```

## 🔑 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Chave pública do projeto Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domínio de auth do Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de storage do Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID do Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase |
| `FIREBASE_PROJECT_ID` | ID do projeto (Admin SDK, secreto) |
| `FIREBASE_CLIENT_EMAIL` | Email da service account (Admin SDK, secreto) |
| `FIREBASE_PRIVATE_KEY` | Chave privada da service account (Admin SDK, secreto) |
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