import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { BotaoDeletar } from "./BotaoDeletar"
import { FiltrosExtrato } from "./FiltrosExtrato"

/**
 * Pagina de extrato completo
 * Lista todos os lancamentos com filtros por carteira e tipo
 */

export default async function ExtratoPage({
  searchParams,
}: {
  searchParams: Promise<{ carteira?: string; tipo?: string }>
}) {
  const params = await searchParams
  const carteira = params.carteira ?? "todos"
  const tipo = params.tipo ?? "todos"

  // Verificar sessao
  const user = await getAuthUser()
  if (!user) return null
  // Buscar lancamentos com filtros
  const lancamentos = await prisma.financeiro.findMany({
    where: {
      userId: user.id,
      ...(carteira !== "todos" ? { carteira } : {}),
      ...(tipo !== "todos" ? { tipo } : {}),
    },
    orderBy: { data: "desc" },
  })

  // Total filtrado
  const totalEntradas = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((acc, l) => acc + Number(l.valor), 0)

  const totalSaidas = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((acc, l) => acc + Number(l.valor), 0)

  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="space-y-6">
      {/* Cabecalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/financeiro"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Extrato</h1>
      </div>

      {/* Filtros */}
      <Suspense>
        <FiltrosExtrato />
      </Suspense>

      {/* Totais dos filtros */}
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {lancamentos.length} lancamento{lancamentos.length !== 1 ? "s" : ""}
        </span>
        <div className="flex gap-4">
          <span className="text-green-600 dark:text-green-400 font-medium">
            +{formatBRL(totalEntradas)}
          </span>
          <span className="text-red-500 font-medium">
            -{formatBRL(totalSaidas)}
          </span>
        </div>
      </div>

      {/* Lista vazia */}
      {lancamentos.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum lancamento encontrado.
          </p>
        </div>
      )}

      {/* Lista de lancamentos */}
      {lancamentos.length > 0 && (
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {lancamentos.map((item) => {
            const isEntrada = item.tipo === "entrada"
            const dataFormatada = new Date(item.data).toLocaleDateString(
              "pt-BR",
              {
                timeZone: "UTC",
              },
            )

            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 sm:px-4 py-3"
              >
                {/* Icone + descricao */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isEntrada
                        ? "bg-green-50 dark:bg-green-950/50"
                        : "bg-red-50 dark:bg-red-950/50"
                    }`}
                  >
                    {isEntrada ? (
                      <TrendingUp size={15} className="text-green-500" />
                    ) : (
                      <TrendingDown size={15} className="text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.descricao}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground/70">
                        {dataFormatada}
                      </span>
                      {item.categoria && (
                        <span className="text-xs text-muted-foreground/70">
                          · {item.categoria}
                        </span>
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          item.carteira === "negocio"
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.carteira === "negocio" ? "Negocio" : "Pessoal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Valor + deletar */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
                  <p
                    className={`text-sm font-semibold ${
                      isEntrada
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {isEntrada ? "+" : "-"}
                    {formatBRL(Number(item.valor))}
                  </p>
                  <BotaoDeletar id={item.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
