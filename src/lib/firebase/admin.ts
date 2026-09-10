import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

// Inicialização adiada para a primeira utilização real (não no top-level do
// módulo): o passo "Collecting page data" do `next build` importa todas as
// rotas para as analisar, e chamar `cert()` nessa altura rebenta se as envs
// do Firebase ainda não estiverem configuradas. Isto garante que o build
// nunca depende de credenciais reais — só os pedidos em runtime dependem.
let app: App | undefined
function getAdminApp(): App {
  if (!app) {
    app = getApps().length
      ? getApps()[0]!
      : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Vars de ambiente costumam escapar as quebras de linha da private key.
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
  }
  return app
}

let authInstance: Auth | undefined
let dbInstance: Firestore | undefined

function lazy<T extends object>(getInstance: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = getInstance()
      const value = Reflect.get(instance as object, prop, instance)
      return typeof value === 'function' ? value.bind(instance) : value
    },
  })
}

export const adminAuth: Auth = lazy(() => authInstance ??= getAuth(getAdminApp()))
export const adminDb: Firestore = lazy(() => dbInstance ??= getFirestore(getAdminApp()))
