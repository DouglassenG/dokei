import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  FileText,
  User,
  Briefcase,
  DollarSign,
  CreditCard,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { BotoesCompartilhar } from "@/app/(dashboard)/recibos/[id]/BotoesCompartilhar"

/**
 * Página pública do recibo — sem login
 * Acessível por qualquer pessoa que tenha o link
 * Ex: dokei.com.br/r/DOK-0001
 */

interface DadosRecibo {
  nomeCliente: string
  servicoDescricao: string
  valor: number
  formaPagamento: string
  data: string
  observacoes?: string
}

interface ReciboPublicoPageProps {
  params: Promise<{ numero: string }>
}

export default async function ReciboPublicoPage({
  params,
}: ReciboPublicoPageProps) {
  const { numero } = await params

  // Busca o recibo pelo número — sem verificar usuário (página pública)
  const recibo = await prisma.documento.findFirst({
    where: { numero, tipo: "recibo", status: "ativo" },
  })

  if (!recibo) notFound()

  const dados = recibo.dadosJson as unknown as DadosRecibo

  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(dados.valor)

  const dataFormatada = new Date(dados.data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  })

  const linkPublico = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/r/${numero}`
  const msgWhatsApp = encodeURIComponent(
    `Segue o recibo ${numero}: ${linkPublico}`,
  )
  const linkPdf = `/api/recibos/${recibo.id}/pdf`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simples — sem menu de usuário */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[#1B5E20]" />
          <span className="text-lg font-bold text-[#1B5E20]">dokei</span>
        </div>
        <span className="text-xs text-gray-400">Recibo {numero}</span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 space-y-6">
        {/* Badge público */}
        <div className="flex justify-center">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
            Recibo verificado
          </span>
        </div>

        {/* Dados do serviço */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Dados do Serviço
          </h2>

          <div className="flex items-start gap-3">
            <User size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Cliente</p>
              <p className="text-sm font-medium text-gray-900">
                {dados.nomeCliente}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Serviço</p>
              <p className="text-sm font-medium text-gray-900">
                {dados.servicoDescricao}
              </p>
            </div>
          </div>

          {dados.observacoes && (
            <div className="flex items-start gap-3">
              <MessageSquare
                size={16}
                className="text-[#1B5E20] mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-gray-400">Observações</p>
                <p className="text-sm font-medium text-gray-900">
                  {dados.observacoes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Valor e pagamento */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Valor e Pagamento
          </h2>

          <div className="flex items-start gap-3">
            <DollarSign size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Valor</p>
              <p className="text-2xl font-bold text-[#1B5E20]">
                {valorFormatado}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Forma de pagamento</p>
              <p className="text-sm font-medium text-gray-900">
                {dados.formaPagamento}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Data de emissão</p>
              <p className="text-sm font-medium text-gray-900">
                {dataFormatada}
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Ações
          </h2>
          <BotoesCompartilhar msgWhatsApp={msgWhatsApp} linkPdf={linkPdf} />
        </div>

        {/* Rodapé dokei */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Recibo gerado pelo{" "}
            <span className="text-[#1B5E20] font-medium">dokei</span> — Gestão
            simples para MEI
          </p>
        </div>
      </main>
    </div>
  )
}
