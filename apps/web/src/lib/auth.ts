import { auth, currentUser } from "@clerk/nextjs/server"

/**
 * Dados do usuário autenticado via Clerk.
 * Equivalente ao antigo `supabase.auth.getUser()`.
 */
export interface AuthUser {
  id: string
  email: string
  nome: string | null
}

/**
 * Retorna o usuário autenticado ou null.
 *
 * Uso em Server Components:
 *   const user = await getAuthUser()
 *   if (!user) redirect("/login")
 *
 * Uso em API Routes:
 *   const user = await getAuthUser()
 *   if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const primeiroEmail = user.emailAddresses[0]?.emailAddress ?? ""
  const nome = user.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : null

  return {
    id: userId,
    email: primeiroEmail,
    nome,
  }
}
