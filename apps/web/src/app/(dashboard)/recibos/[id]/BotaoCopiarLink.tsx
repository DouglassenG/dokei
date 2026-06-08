"use client"

/**
 * BotaoCopiarLink — componente client
 *
 * Separado do Server Component porque usa navigator.clipboard
 * que só funciona no browser (lado do cliente).
 */

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface BotaoCopiarLinkProps {
  link: string
}

export function BotaoCopiarLink({ link }: BotaoCopiarLinkProps) {
  // Controla o feedback visual após copiar
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(link)
    setCopiado(true)
    // Volta ao estado normal após 2 segundos
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
      <p className="text-xs text-muted-foreground flex-1 truncate">{link}</p>
      <button
        onClick={copiar}
        className="flex items-center gap-1 text-xs text-[#1B5E20] dark:text-[#8BC34A] font-medium hover:underline shrink-0 transition-colors"
      >
        {copiado ? (
          <>
            <Check size={13} />
            Copiado!
          </>
        ) : (
          <>
            <Copy size={13} />
            Copiar
          </>
        )}
      </button>
    </div>
  )
}
