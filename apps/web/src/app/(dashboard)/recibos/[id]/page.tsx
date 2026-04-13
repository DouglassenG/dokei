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
  Share2,
  Download,
} from "lucide-react"
import { BotaoCopiarLink } from "./BotaoCopiarLink"

/**
 * Tipagem dos dados armazenados no dadosJson do recibo
 */
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

  // Verificar sessão
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  // Buscar recibo no banco — garante que só vê o próprio recibo
  const recibo = await prisma.documento.findFirst({
    where: { id, userId: user.id, tipo: "recibo" },
  })

  if (!recibo) notFound()

  const dados = recibo.dadosJson as unknown as DadosRecibo

  // Formata valor para BRL
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(dados.valor)

  // Formata data para pt-BR
  const dataFormatada = new Date(dados.data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  })

  // Link público do recibo — sem login
  const linkPublico = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/r/${recibo.numero}`

  // Mensagem pré-preenchida para o WhatsApp
  const msgWhatsApp = encodeURIComponent(
    `Segue o recibo ${recibo.numero}: ${linkPublico}`
  )

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
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
              <p className="text-sm text-gray-500">Emitido em {dataFormatada}</p>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
          Ativo
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
            <p className="text-sm font-medium text-gray-900">{dados.nomeCliente}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Briefcase size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Serviço</p>
            <p className="text-sm font-medium text-gray-900">{dados.servicoDescricao}</p>
          </div>
        </div>

        {dados.observacoes && (
          <div className="flex items-start gap-3">
            <MessageSquare size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Observações</p>
              <p className="text-sm font-medium text-gray-900">{dados.observacoes}</p>
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
            <p className="text-2xl font-bold text-[#1B5E20]">{valorFormatado}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Forma de pagamento</p>
            <p className="text-sm font-medium text-gray-900">{dados.formaPagamento}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-[#1B5E20] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Data de emissão</p>
            <p className="text-sm font-medium text-gray-900">{dataFormatada}</p>
          </div>
        </div>
      </div>

      {/* Ações de compartilhamento */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Compartilhar
        </h2>

        {/* WhatsApp */}
        
          href={`https://wa.me/?text=${msgWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5d] py-3 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <Share2 size={18} />
          Compartilhar no WhatsApp
        </a>

        {/* PDF */}
        
          href={`/api/recibos/${recibo.id}/pdf`}
          target="_blank"
          className="w-full flex items-center justify-center gap-2 border border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20]/5 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={18} />
          Baixar PDF
        </a>

        {/* Link público com botão copiar — Client Component */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Link público do recibo</p>
          <BotaoCopiarLink link={linkPublico} />
        </div>
      </div>

    </div>
  )
}