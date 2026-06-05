"use client"

import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

/**
 * Botao de logout usando Clerk.
 * Substitui o antigo form action={logout} do Supabase.
 */
export function LogoutButton() {
  const { signOut } = useClerk()

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/login" })}
      className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Sair</span>
    </button>
  )
}
