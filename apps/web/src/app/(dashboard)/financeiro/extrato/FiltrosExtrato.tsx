"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function FiltrosExtrato() {
  const router = useRouter()
  const params = useSearchParams()
  const carteira = params.get("carteira") ?? "todos"
  const tipo = params.get("tipo") ?? "todos"

  function filtrarCarteira(c: string) {
    router.push(`/financeiro/extrato?carteira=${c}&tipo=${tipo}`)
  }

  function filtrarTipo(t: string) {
    router.push(`/financeiro/extrato?carteira=${carteira}&tipo=${t}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {["todos", "negocio", "pessoal"].map((c) => (
        <button
          key={c}
          onClick={() => filtrarCarteira(c)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            carteira === c
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted"
          }`}
        >
          {c === "todos" ? "Todas" : c === "negocio" ? "Negocio" : "Pessoal"}
        </button>
      ))}

      <span className="shrink-0 text-muted-foreground/50">|</span>

      {["todos", "entrada", "saida"].map((t) => (
        <button
          key={t}
          onClick={() => filtrarTipo(t)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            tipo === t
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted"
          }`}
        >
          {t === "todos" ? "Todos" : t === "entrada" ? "Entradas" : "Saidas"}
        </button>
      ))}
    </div>
  )
}
