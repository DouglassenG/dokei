"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  BarChart2,
  Menu,
  X,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface SidebarProps {
  userEmail: string
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recibos", href: "/recibos", icon: FileText },
  { label: "Financeiro", href: "/financeiro", icon: TrendingUp },
  { label: "Obrigacoes", href: "/obrigacoes", icon: Bell },
  { label: "Calculadora", href: "/calculadora", icon: Calculator },
  { label: "Rendimentos", href: "/rendimentos", icon: BarChart2 },
]

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [aberto, setAberto] = useState(false)

  const fechar = useCallback(() => setAberto(false), [])

  return (
    <>
      {/* Botao hamburguer — visivel apenas em telas menores que lg */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        className="fixed top-4 left-4 z-40 lg:hidden w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center border border-sidebar-border shadow-sm"
      >
        <Menu size={20} className="text-sidebar-foreground" />
      </button>

      {/* Overlay escuro — apenas mobile/tablet quando aberto */}
      {aberto && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={fechar}
        />
      )}

      {/* Painel da sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${aberto ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo + botao fechar no mobile */}
        <div className="px-6 py-6 border-b border-sidebar-border flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={fechar}
          >
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-sidebar-foreground">
              Dokei
            </span>
          </Link>

          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar menu"
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
          >
            <X size={18} className="text-sidebar-foreground" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const ativo =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={fechar}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    ativo
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-sidebar-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sidebar-foreground text-sm font-semibold">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sidebar-foreground/60">Logado como</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
