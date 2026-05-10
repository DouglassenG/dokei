"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  BarChart2,
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
  { label: "Início", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recibos", href: "/recibos", icon: FileText },
  { label: "Financeiro", href: "/financeiro", icon: TrendingUp },
  { label: "Obrigações", href: "/obrigacoes", icon: Bell },
  { label: "Calculadora", href: "/calculadora-preco", icon: Calculator },
  { label: "Rendimentos", href: "/rendimentos", icon: BarChart2 },
]

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">
              D
            </span>
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">
            Dokei
          </span>
        </Link>
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
  )
}
