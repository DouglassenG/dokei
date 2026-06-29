"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"

export function BotaoDeletar({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleClick() {
    if (!confirming) {
      setConfirming(true)
      timerRef.current = setTimeout(() => setConfirming(false), 3000)
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    setConfirming(false)
    setLoading(true)
    fetch(`/api/financeiro/${id}`, { method: "DELETE" }).then(() => {
      router.refresh()
      setLoading(false)
    })
  }

  if (loading) {
    return (
      <button
        disabled
        className="p-1.5 text-muted-foreground/70 rounded-lg disabled:opacity-60"
      >
        <Loader2 size={15} className="animate-spin" />
      </button>
    )
  }

  if (confirming) {
    return (
      <button
        onClick={handleClick}
        title="Clique para confirmar exclusão"
        className="p-1.5 text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg transition-colors animate-pulse"
      >
        <AlertTriangle size={15} />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="p-1.5 text-muted-foreground/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
    >
      <Trash2 size={15} />
    </button>
  )
}
