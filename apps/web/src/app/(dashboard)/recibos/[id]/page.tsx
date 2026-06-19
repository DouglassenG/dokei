import { notFound } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
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

  const user = await getAuthUser()
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
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText
              size={22}
              className="text-primary"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Recibo {recibo.numero}
              </h1>
              <p className="text-sm text-muted-foreground">
                Emitido em {dataFormatada}
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 self-start sm:self-auto">
          Ativo
        </span>
      </div>

      {/* Dados do servico */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Dados do Servico
        </h2>
        <div className="flex items-start gap-3">
          <User
            size={16}
            className="text-primary mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs text-muted-foreground/70">Cliente</p>
            <p className="text-sm font-medium text-foreground">
              {dados.nomeCliente}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Briefcase
            size={16}
            className="text-primary mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs text-muted-foreground/70">Servico</p>
            <p className="text-sm font-medium text-foreground">
              {dados.servicoDescricao}
            </p>
          </div>
        </div>
        {dados.observacoes && (
          <div className="flex items-start gap-3">
            <MessageSquare
              size={16}
              className="text-primary mt-0.5 shrink-0"
            />
            <div>
              <p className="text-xs text-muted-foreground/70">Observacoes</p>
              <p className="text-sm font-medium text-foreground">
                {dados.observacoes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Valor e pagamento */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Valor e Pagamento
        </h2>
        <div className="flex items-start gap-3">
          <DollarSign
            size={16}
            className="text-primary mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs text-muted-foreground/70">Valor</p>
            <p className="text-2xl font-bold text-primary">
              {valorFormatado}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard
            size={16}
            className="text-primary mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs text-muted-foreground/70">
              Forma de pagamento
            </p>
            <p className="text-sm font-medium text-foreground">
              {dados.formaPagamento}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar
            size={16}
            className="text-primary mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs text-muted-foreground/70">Data de emissao</p>
            <p className="text-sm font-medium text-foreground">
              {dataFormatada}
            </p>
          </div>
        </div>
      </div>

      {/* Acoes de compartilhamento */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Compartilhar
        </h2>
        <BotoesCompartilhar msgWhatsApp={msgWhatsApp} linkPdf={linkPdf} />
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground/70 mb-1">
            Link publico do recibo
          </p>
          <BotaoCopiarLink link={linkPublico} />
        </div>
      </div>
    </div>
  )
}
