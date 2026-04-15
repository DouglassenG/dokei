"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

/**
 * BotaoMarcarFeito — Client Component
 * Chama PATCH /api/lembretes com status=concluido e recarrega a página
 */
export function BotaoMarcarFeito({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function marcarFeito() {
    setLoading(true)
    await fetch("/api/lembretes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "concluido" }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={marcarFeito}
      disabled={loading}
      className="flex items-center gap-1 text-xs text-[#1B5E20] hover:underline disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <CheckCircle size={12} />
      )}
      Marcar como pago
    </button>
  )
}
