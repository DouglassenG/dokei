"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

/**
 * BotaoDeletar — Client Component
 * Chama DELETE /api/financeiro/[id] e recarrega a página
 */
export function BotaoDeletar({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function deletar() {
    if (!confirm("Excluir este lançamento?")) return
    setLoading(true)

    await fetch(`/api/financeiro/${id}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={deletar}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  )
}
