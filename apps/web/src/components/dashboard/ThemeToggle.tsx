"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
  }, [])

  if (!montado) {
    return <div className="w-9 h-9 rounded-lg bg-muted/50" aria-hidden="true" />
  }

  const escuro = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      className="
        cursor-pointer w-9 h-9 rounded-lg flex items-center justify-center
        text-muted-foreground hover:text-foreground hover:bg-muted/50
        transition-colors
      "
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
