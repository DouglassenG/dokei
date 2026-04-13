"use client"

/**
 * Formulário de criação de novo recibo
 *
 * Campos obrigatórios: nome do cliente, descrição do serviço, valor, forma de pagamento
 * Campos pré-preenchidos: dados do prestador (via sessão)
 * Ao submeter: POST /api/recibos → redireciona para /recibos/[id]
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,      // botão voltar
  FileText,       // ícone do título
  User,           // ícone do cliente
  Briefcase,      // ícone do serviço
  DollarSign,     // ícone do valor
  CreditCard,     // ícone da forma de pagamento
  Calendar,       // ícone da data
  MessageSquare,  // ícone das observações
  Loader2,        // ícone de loading
  Send,           // ícone do botão enviar
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

  // ─── Estado do formulário ───────────────────────────────────────────────

  const [form, setForm] = useState({
    nomeCliente: "",
    servicoDescricao: "",
    valor: "",
    formaPagamento: "Pix",
    data: new Date().toISOString().split("T")[0], // data de hoje como padrão
    observacoes: "",
  })

  // Estado de envio — controla o loading e erros
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [erroMsg, setErroMsg] = useState("")

  // ─── Handlers ───────────────────────────────────────────────────────────

  // Atualiza qualquer campo do formulário genericamente
  function handleChange(
    e: React.ChangeEvent
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
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
          // Converte valor para número antes de enviar
          valor: Number(form.valor.replace(",", ".")),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErroMsg(data.error ?? "Erro ao criar recibo.")
        setStatus("error")
        return
      }

      // Sucesso — redireciona para a página do recibo criado
      router.push(`/recibos/${data.id}`)
    } catch {
      setErroMsg("Erro de conexão. Tente novamente.")
      setStatus("error")
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho da página */}
      <div className="flex items-center gap-3">
        <Link
          href="/recibos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-[#1B5E20]" />
          <h1 className="text-xl font-bold text-gray-900">Novo Recibo</h1>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Bloco: dados do cliente e serviço */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Dados do Serviço
          </h2>

          {/* Nome do cliente */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors"
            />
          </div>

          {/* Descrição do serviço */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <Briefcase size={15} />
              Descrição do serviço
            </label>
            <textarea
              name="servicoDescricao"
              placeholder="Ex: Instalação elétrica residencial"
              value={form.servicoDescricao}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors resize-none"
            />
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <MessageSquare size={15} />
              Observações
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="observacoes"
              placeholder="Ex: Serviço realizado conforme combinado"
              value={form.observacoes}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Bloco: valor e pagamento */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Valor e Pagamento
          </h2>

          {/* Valor */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <DollarSign size={15} />
              Valor do serviço
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors">
              <span className="px-4 py-3 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">
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
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <CreditCard size={15} />
              Forma de pagamento
            </label>
            <select
              name="formaPagamento"
              value={form.formaPagamento}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors bg-white"
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
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <Calendar size={15} />
              Data de emissão
            </label>
            <input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors"
            />
          </div>
        </div>

        {/* Mensagem de erro */}
        {status === "error" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{erroMsg}</p>
          </div>
        )}

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] py-3 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
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