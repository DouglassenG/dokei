"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Loader2, TrendingUp, TrendingDown } from "lucide-react"

const CATEGORIAS = {
  negocio: [
    "Serviço recebido",
    "Material de trabalho",
    "Equipamento",
    "Marketing",
    "Outros",
  ],
  pessoal: ["Alimentação", "Transporte", "Saúde", "Lazer", "Outros"],
}

export function LancamentoRapido() {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [form, setForm] = useState({
    tipo: "entrada" as "entrada" | "saida",
    descricao: "",
    valor: "",
    carteira: "negocio" as "negocio" | "pessoal",
    categoria: "Outros",
    data: new Date().toISOString().split("T")[0],
  })
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [erroMsg, setErroMsg] = useState("")

  const alertaMistura =
    form.carteira === "negocio" &&
    CATEGORIAS.pessoal.includes(form.categoria) &&
    form.categoria !== "Outros"

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErroMsg("")

    try {
      const response = await fetch("/api/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          valor: Number(form.valor.replace(",", ".")),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErroMsg(data.error ?? "Erro ao salvar lançamento.")
        setStatus("error")
        return
      }

      setAberto(false)
      setForm({
        tipo: "entrada",
        descricao: "",
        valor: "",
        carteira: "negocio",
        categoria: "Outros",
        data: new Date().toISOString().split("T")[0],
      })
      setStatus("idle")
      router.refresh()
    } catch {
      setErroMsg("Erro de conexão. Tente novamente.")
      setStatus("error")
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-6 right-24 flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-full shadow-lg text-sm font-medium transition-colors z-40"
      >
        <Plus size={18} />
        Novo lançamento
      </button>

      {aberto && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setAberto(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 ${aberto ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="p-6 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Novo lançamento
            </h2>
            <button
              onClick={() => setAberto(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, tipo: "entrada" }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${form.tipo === "entrada" ? "bg-green-500 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <TrendingUp size={16} />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, tipo: "saida" }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${form.tipo === "saida" ? "bg-red-500 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <TrendingDown size={16} />
                Saída
              </button>
            </div>

            <div className="flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <span className="px-4 py-3 bg-muted text-sm text-muted-foreground border-r border-border">
                R$
              </span>
              <input
                name="valor"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={form.valor}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            <input
              name="descricao"
              type="text"
              placeholder="Ex: Serviço de pintura"
              value={form.descricao}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, carteira: "negocio" }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${form.carteira === "negocio" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                Negócio
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, carteira: "pessoal" }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${form.carteira === "pessoal" ? "bg-gray-500 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                Pessoal
              </button>
            </div>

            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChangeSelect}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            >
              {CATEGORIAS[form.carteira].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {alertaMistura && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Parece uma despesa pessoal. Considere mover para a carteira
                  Pessoal.
                </p>
              </div>
            )}

            <input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {status === "error" && (
              <p className="text-sm text-red-500">{erroMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {status === "loading" ? "Salvando..." : "Salvar lançamento"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
