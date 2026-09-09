"use client"

/**
 * Pagina isolada de demonstracao: o front (Next.js) chama a api-java
 * (Spring Boot) por HTTP, em vez de usar o Prisma direto.
 *
 * Nao substitui a pagina real de recibos (/recibos) — e so uma prova
 * de integracao entre as duas stacks, para portfolio.
 */

import { useState } from "react"
import { Search, Loader2, Server } from "lucide-react"

interface ReciboDaApiJava {
  id: string
  numero: string
  nomeCliente: string
  servicoDescricao: string
  valor: number
  formaPagamento: string
  data: string
  observacoes: string | null
  status: string
  criadoEm: string
}

export default function JavaDemoPage() {
  const [numero, setNumero] = useState("DOK-0008")
  const [recibo, setRecibo] = useState<ReciboDaApiJava | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [erroMsg, setErroMsg] = useState("")

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErroMsg("")
    setRecibo(null)

    const baseUrl = process.env.NEXT_PUBLIC_API_JAVA_URL

    try {
      const response = await fetch(`${baseUrl}/api/recibos/${numero}`)

      if (!response.ok) {
        setErroMsg(
          response.status === 404
            ? `Nenhum recibo encontrado com o numero "${numero}".`
            : `A API Java respondeu com erro (${response.status}).`,
        )
        setStatus("error")
        return
      }

      const data: ReciboDaApiJava = await response.json()
      setRecibo(data)
      setStatus("idle")
    } catch {
      setErroMsg(
        "Nao foi possivel conectar na API Java. Ela esta rodando em " +
          "localhost:8080 (mvn spring-boot:run dentro de apps/api-java)?",
      )
      setStatus("error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server size={22} className="text-primary" />
        <h1 className="text-xl font-bold text-foreground">
          Demo: Front consumindo a API Java
        </h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Busca um recibo direto na <code>api-java</code> (Spring Boot), via HTTP
        — nao usa o Prisma nesta tela.
      </p>

      <form
        onSubmit={handleBuscar}
        className="bg-card rounded-2xl border border-border p-6 space-y-4"
      >
        <label className="block text-sm font-semibold text-muted-foreground">
          Numero do recibo
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="DOK-0008"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Buscar
          </button>
        </div>

        {status === "error" && (
          <p className="text-sm text-destructive">{erroMsg}</p>
        )}
      </form>

      {recibo && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Resposta da api-java
          </h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Numero</dt>
            <dd className="text-foreground">{recibo.numero}</dd>

            <dt className="text-muted-foreground">Cliente</dt>
            <dd className="text-foreground">{recibo.nomeCliente}</dd>

            <dt className="text-muted-foreground">Servico</dt>
            <dd className="text-foreground">{recibo.servicoDescricao}</dd>

            <dt className="text-muted-foreground">Valor</dt>
            <dd className="text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(recibo.valor)}
            </dd>

            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">{recibo.status}</dd>
          </dl>
        </div>
      )}
    </div>
  )
}
