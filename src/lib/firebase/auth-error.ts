import { FirebaseError } from 'firebase/app'

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email ou password incorretos.',
  'auth/invalid-email': 'Email inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/user-not-found': 'Email ou password incorretos.',
  'auth/wrong-password': 'Email ou password incorretos.',
  'auth/email-already-in-use': 'Já existe uma conta com este email.',
  'auth/weak-password': 'A password tem de ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiadas tentativas. Tenta novamente mais tarde.',
}

/** Traduz um erro do Firebase Auth (ou de rede/sessão) numa mensagem amigável em PT. */
export function firebaseAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    return MESSAGES[err.code] || 'Ocorreu um erro. Tenta novamente.'
  }
  return 'Ocorreu um erro. Tenta novamente.'
}
