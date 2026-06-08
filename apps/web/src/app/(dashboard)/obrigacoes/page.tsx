import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { BotaoMarcarFeito } from "./BotaoMarcarFeito"
import { LinkDAS, LinkDASN } from "./LinksExternos"

/**
 * Pagina de Obrigacoes Fiscais do MEI
 * Exibe checklist de lembretes (DAS + DASN) e monitor de faturamento anual
 */
export default async function ObrigacoesPage() {
  const user = await getAuthUser()
  if (!user) return null
  const usuarioExiste = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!usuarioExiste) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        plano: "gratis",
      },
    })
  }

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
    if (status === "concluido")
      return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50"
    const dias = diasAteVencimento(vencimento)
    if (dias < 0)
      return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50"
    if (dias <= 5)
      return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50"
    return "border-border bg-card"
  }

  return (
    <div className="space-y-6">
      {/* Cabecalho */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Obrigacoes Fiscais
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Nunca perca um prazo importante do seu MEI.
        </p>
      </div>

      {/* Monitor de faturamento anual */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Faturamento Anual {new Date().getFullYear()}
        </h2>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatBRL(faturamentoAnual)}
          </span>
          <span className="text-muted-foreground/70">
            limite: {formatBRL(limiteAnualMEI)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
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
              ? "text-red-600 dark:text-red-400"
              : percentualFaturamento >= 70
                ? "text-orange-600 dark:text-orange-400"
                : "text-muted-foreground"
          }`}
        >
          {percentualFaturamento >= 90
            ? "Procure um contador para entender suas opcoes."
            : percentualFaturamento >= 70
              ? "Voce esta se aproximando do limite anual."
              : `${percentualFaturamento.toFixed(1)}% do limite anual utilizado.`}
        </p>
      </div>

      {/* Checklist de obrigacoes */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Obrigacoes
        </h2>

        {lembretes.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-10 text-center">
            <Clock
              size={32}
              className="text-muted-foreground/50 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Nenhuma obrigacao cadastrada ainda.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Os lembretes sao gerados automaticamente no dia 1 de cada mes.
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
              className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${getCardStyle(lembrete.status, lembrete.vencimento)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
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
                    <p className="text-sm font-semibold text-foreground">
                      {lembrete.tipo === "DAS"
                        ? "DAS — Pagamento Mensal"
                        : "DASN-SIMEI — Declaracao Anual"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Vence em {formatData(lembrete.vencimento)}
                      {!concluido && (
                        <span
                          className={`ml-2 font-medium ${
                            atrasado
                              ? "text-red-500"
                              : dias <= 5
                                ? "text-orange-500"
                                : "text-muted-foreground/70"
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
                  className={`text-xs px-2 py-1 rounded-full font-medium self-start ${
                    concluido
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      : atrasado
                        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                        : "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {concluido ? "Pago" : atrasado ? "Atrasado" : "Pendente"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {lembrete.descricao}
              </p>

              {!concluido && (
                <div className="flex items-center gap-3 flex-wrap">
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
