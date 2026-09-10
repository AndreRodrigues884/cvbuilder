import { getApps, initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let authInstance: Auth | undefined

// Inicialização adiada para o primeiro clique real (não no top-level do
// módulo): components 'use client' são pré-renderizados no servidor durante
// o build/SSR, e `getAuth()` valida a config nessa altura — o que rebenta se
// a app correr sem as envs do Firebase configuradas (ex: build de CI).
export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
    authInstance = getAuth(app)
  }
  return authInstance
}
