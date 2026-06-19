"use client"

/**
 * Formulário de criação de novo recibo
 *
 * Campos obrigatórios: nome do cliente, descrição do serviço, valor, forma de pagamento
 * Ao submeter: POST /api/recibos → redireciona para /recibos/[id]
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  User,
  Briefcase,
  DollarSign,
  CreditCard,
  Calendar,
  MessageSquare,
  Loader2,
  Send,
} from "lucide-react"

// Formas de pagamento disponíveis para o MEI
const FORMAS_PAGAMENTO = [
  "Pix",
  "Transferência Bancária",
  "Dinheiro",
  "Cartão de Débito",
  "Cartão de Crédito",
  "Boleto",
]

export default function NovoReciboPage() {
  const router = useRouter()

  // Estado do formulário
  const [form, setForm] = useState({
    nomeCliente: "",
    servicoDescricao: "",
    valor: "",
    formaPagamento: "Pix",
    data: new Date().toISOString().split("T")[0],
    observacoes: "",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [erroMsg, setErroMsg] = useState("")

  // Handler genérico para todos os campos do formulário
  // Tipagem inline evita o problema de corrupção do union type
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleChangeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Envia o formulário para a API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErroMsg("")

    try {
      const response = await fetch("/api/recibos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          valor: Number(form.valor.replace(",", ".")),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErroMsg(data.error ?? "Erro ao criar recibo.")
        setStatus("error")
        return
      }

      router.push(`/recibos/${data.id}`)
    } catch {
      setErroMsg("Erro de conexão. Tente novamente.")
      setStatus("error")
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/recibos"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Novo Recibo</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bloco: dados do cliente e serviço */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Dados do Serviço
          </h2>

          {/* Nome do cliente */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <User size={15} />
              Nome do cliente
            </label>
            <input
              name="nomeCliente"
              type="text"
              placeholder="Ex: João Silva"
              value={form.nomeCliente}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/40 transition-colors"
            />
          </div>

          {/* Descrição do serviço */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <Briefcase size={15} />
              Descrição do serviço
            </label>
            <textarea
              name="servicoDescricao"
              placeholder="Ex: Instalação elétrica residencial"
              value={form.servicoDescricao}
              onChange={handleChangeTextarea}
              required
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/40 transition-colors resize-none"
            />
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <MessageSquare size={15} />
              Observações
              <span className="text-muted-foreground/70 font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              name="observacoes"
              placeholder="Ex: Serviço realizado conforme combinado"
              value={form.observacoes}
              onChange={handleChangeTextarea}
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/40 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Bloco: valor e pagamento */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Valor e Pagamento
          </h2>

          {/* Valor */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <DollarSign size={15} />
              Valor do serviço
            </label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary hover:border-primary/40 transition-colors">
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
          </div>

          {/* Forma de pagamento */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <CreditCard size={15} />
              Forma de pagamento
            </label>
            <select
              name="formaPagamento"
              value={form.formaPagamento}
              onChange={handleChangeSelect}
              required
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/40 transition-colors bg-card"
            >
              {FORMAS_PAGAMENTO.map((forma) => (
                <option key={forma} value={forma}>
                  {forma}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <Calendar size={15} />
              Data de emissão
            </label>
            <input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Mensagem de erro */}
        {status === "error" && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{erroMsg}</p>
          </div>
        )}

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {status === "loading" ? "Gerando recibo..." : "Gerar recibo"}
        </button>
      </form>
    </div>
  )
}
