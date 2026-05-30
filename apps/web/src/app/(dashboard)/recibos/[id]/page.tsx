import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
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
} from "lucide-react"
import { BotaoCopiarLink } from "./BotaoCopiarLink"
import { BotoesCompartilhar } from "./BotoesCompartilhar"

interface DadosRecibo {
  nomeCliente: string
  servicoDescricao: string
  valor: number
  formaPagamento: string
  data: string
  observacoes?: string
}

interface ReciboPageProps {
  params: Promise<{ id: string }>
}

export default async function ReciboPage({ params }: ReciboPageProps) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const recibo = await prisma.documento.findFirst({
    where: { id, userId: user.id, tipo: "recibo" },
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

  const linkPublico = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/r/${recibo.numero}`
  const msgWhatsApp = encodeURIComponent(
    `Segue o recibo ${recibo.numero}: ${linkPublico}`,
  )
  const linkPdf = `/api/recibos/${recibo.id}/pdf`

  return (
    <div className="space-y-6">
      {/* Cabecalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/recibos"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText size={22} className="text-[#1B5E20]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Recibo {recibo.numero}
              </h1>
              <p className="text-sm text-gray-500">
                Emitido em {dataFormatada}
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 self-start sm:self-auto">
          Ativo
        </span>
      </div>

      {/* Dados do servico */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Dados do Servico
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
            <p className="text-xs text-gray-400">Servico</p>
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
              <p className="text-xs text-gray-400">Observacoes</p>
              <p className="text-sm font-medium text-gray-900">
                {dados.observacoes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Valor e pagamento */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-5">
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
            <p className="text-xs text-gray-400">Data de emissao</p>
            <p className="text-sm font-medium text-gray-900">{dataFormatada}</p>
          </div>
        </div>
      </div>

      {/* Acoes de compartilhamento */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Compartilhar
        </h2>
        <BotoesCompartilhar msgWhatsApp={msgWhatsApp} linkPdf={linkPdf} />
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Link publico do recibo</p>
          <BotaoCopiarLink link={linkPublico} />
        </div>
      </div>
    </div>
  )
}
