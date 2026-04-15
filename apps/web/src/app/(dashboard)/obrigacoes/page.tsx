import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { BotaoMarcarFeito } from "./BotaoMarcarFeito"
import { LinkDAS, LinkDASN } from "./LinksExternos"

/**
 * Página de Obrigações Fiscais do MEI
 * Exibe checklist de lembretes (DAS + DASN) e monitor de faturamento anual
 */
export default async function ObrigacoesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? "",
      nome: user.user_metadata?.full_name ?? null,
      plano: "gratis",
    },
  })

  const lembretes = await prisma.lembrete.findMany({
    where: { userId: user.id },
    orderBy: { vencimento: "asc" },
  })

  const inicioAno = new Date(new Date().getFullYear(), 0, 1)
  const recibosAno = await prisma.documento.findMany({
    where: {
      userId: user.id,
      tipo: "recibo",
      status: "ativo",
      criadoEm: { gte: inicioAno },
    },
    select: { dadosJson: true },
  })

  const faturamentoAnual = recibosAno.reduce((acc, doc) => {
    const dados = doc.dadosJson as unknown as { valor?: number }
    return acc + (dados?.valor ?? 0)
  }, 0)

  const limiteAnualMEI = 81900
  const percentualFaturamento = Math.min(
    (faturamentoAnual / limiteAnualMEI) * 100,
    100,
  )

  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  function formatData(data: Date) {
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" })
  }

  function diasAteVencimento(data: Date) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const venc = new Date(data)
    venc.setHours(0, 0, 0, 0)
    return Math.round((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  }

  function getCardStyle(status: string, vencimento: Date) {
    if (status === "concluido") return "border-green-200 bg-green-50"
    const dias = diasAteVencimento(vencimento)
    if (dias < 0) return "border-red-200 bg-red-50"
    if (dias <= 5) return "border-orange-200 bg-orange-50"
    return "border-gray-100 bg-white"
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Obrigações Fiscais</h1>
        <p className="text-sm text-gray-500 mt-1">
          Nunca perca um prazo importante do seu MEI.
        </p>
      </div>

      {/* Monitor de faturamento anual */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Faturamento Anual {new Date().getFullYear()}
        </h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{formatBRL(faturamentoAnual)}</span>
          <span className="text-gray-400">
            limite: {formatBRL(limiteAnualMEI)}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              percentualFaturamento >= 90
                ? "bg-red-500"
                : percentualFaturamento >= 70
                  ? "bg-orange-400"
                  : "bg-[#1B5E20]"
            }`}
            style={{ width: `${percentualFaturamento}%` }}
          />
        </div>
        <p
          className={`text-xs ${
            percentualFaturamento >= 90
              ? "text-red-600"
              : percentualFaturamento >= 70
                ? "text-orange-600"
                : "text-gray-500"
          }`}
        >
          {percentualFaturamento >= 90
            ? "Procure um contador para entender suas opções."
            : percentualFaturamento >= 70
              ? "Você está se aproximando do limite anual."
              : `${percentualFaturamento.toFixed(1)}% do limite anual utilizado.`}
        </p>
      </div>

      {/* Checklist de obrigações */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Obrigações
        </h2>

        {lembretes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <Clock size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Nenhuma obrigação cadastrada ainda.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Os lembretes são gerados automaticamente no dia 1 de cada mês.
            </p>
          </div>
        )}

        {lembretes.map((lembrete) => {
          const dias = diasAteVencimento(lembrete.vencimento)
          const concluido = lembrete.status === "concluido"
          const atrasado = dias < 0 && !concluido

          return (
            <div
              key={lembrete.id}
              className={`rounded-2xl border p-5 space-y-3 ${getCardStyle(lembrete.status, lembrete.vencimento)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {concluido ? (
                    <CheckCircle
                      size={18}
                      className="text-green-500 shrink-0"
                    />
                  ) : atrasado ? (
                    <AlertTriangle
                      size={18}
                      className="text-red-500 shrink-0"
                    />
                  ) : (
                    <Clock size={18} className="text-orange-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {lembrete.tipo === "DAS"
                        ? "DAS — Pagamento Mensal"
                        : "DASN-SIMEI — Declaração Anual"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Vence em {formatData(lembrete.vencimento)}
                      {!concluido && (
                        <span
                          className={`ml-2 font-medium ${
                            atrasado
                              ? "text-red-500"
                              : dias <= 5
                                ? "text-orange-500"
                                : "text-gray-400"
                          }`}
                        >
                          {atrasado
                            ? `Atrasado ${Math.abs(dias)} dias`
                            : `${dias} dias restantes`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    concluido
                      ? "bg-green-100 text-green-700"
                      : atrasado
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {concluido ? "Pago" : atrasado ? "Atrasado" : "Pendente"}
                </span>
              </div>

              <p className="text-xs text-gray-500">{lembrete.descricao}</p>

              {!concluido && (
                <div className="flex items-center gap-3">
                  {lembrete.tipo === "DAS" && <LinkDAS />}
                  {lembrete.tipo === "DASN" && <LinkDASN />}
                  <BotaoMarcarFeito id={lembrete.id} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
