// Layout do dashboard — verifica sessão antes de renderizar
// Se não estiver logado → redireciona para login

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/(auth)/actions"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/dashboard/ThemeToggle"
import { LogOut } from "lucide-react"

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar fixa à esquerda */}
        <Sidebar userEmail={user.email ?? ""} />

        {/* Área de conteúdo */}
        <div className="flex-1 ml-64">
          {/* Barra superior */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="px-8 py-4 flex items-center justify-end gap-4">
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
                  Sair
                </button>
              </form>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="px-8 py-8 max-w-6xl">{children}</main>
        </div>
      </div>
    </div>
  )
}
