// Layout do dashboard — verifica sessao antes de renderizar
// Se nao estiver logado → redireciona para login

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/(auth)/actions"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/dashboard/ThemeToggle"
import { LogOut } from "lucide-react"

// Tipagem do layout — children e obrigatorio
interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Verifica sessao no servidor — nunca no cliente
  // Garante que nenhuma rota do dashboard e acessivel sem login
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar fixa a esquerda */}
        <Sidebar userEmail={user.email ?? ""} />

        {/* Area de conteudo — margem esquerda apenas em desktop */}
        <div className="flex-1 lg:ml-64">
          {/* Barra superior */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="pl-16 pr-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end gap-4">
              <ThemeToggle />

              <div className="h-6 w-px bg-border" />

              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>

              <form action={logout}>
                <button
                  type="submit"
                  className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </form>
            </div>
          </header>

          {/* Conteudo da pagina */}
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
