// Layout do dashboard — verifica sessão antes de renderizar
// Se não estiver logado → redireciona para login

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/(auth)/actions"

// Tipagem do layout — children é obrigatório
interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Verifica sessão no servidor — nunca no cliente
  // Garante que nenhuma rota do dashboard é acessível sem login
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">dokei</span>

          <div className="flex items-center gap-4">
            {/* Exibe o e-mail do usuário logado */}
            <span className="text-sm text-gray-500">{user.email}</span>

            {/* Logout — chama Server Action diretamente */}
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Conteúdo da página */}
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
