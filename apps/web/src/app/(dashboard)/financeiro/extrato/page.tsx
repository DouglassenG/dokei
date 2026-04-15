import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Trash2 } from "lucide-react"
import { BotaoDeletar } from "./BotaoDeletar"

/**
 * Página de extrato completo
 * Lista todos os lançamentos com filtros por carteira e tipo
 */

export default async function ExtratoPage({
  searchParams,
}: {
  searchParams: Promise<{ carteira?: string; tipo?: string }>
}) {
  const params = await searchParams
  const carteira = params.carteira ?? "todos"
  const tipo = params.tipo ?? "todos"

  // Verificar sessão
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Buscar lançamentos com filtros
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
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/financeiro"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Extrato</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {/* Filtro carteira */}
        {["todos", "negocio", "pessoal"].map((c) => (
          <Link
            key={c}
            href={`/financeiro/extrato?carteira=${c}&tipo=${tipo}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              carteira === c
                ? "bg-[#1B5E20] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c === "todos" ? "Todas" : c === "negocio" ? "Negócio" : "Pessoal"}
          </Link>
        ))}

        <span className="text-gray-300">|</span>

        {/* Filtro tipo */}
        {["todos", "entrada", "saida"].map((t) => (
          <Link
            key={t}
            href={`/financeiro/extrato?carteira=${carteira}&tipo=${t}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tipo === t
                ? "bg-[#1B5E20] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t === "todos" ? "Todos" : t === "entrada" ? "Entradas" : "Saídas"}
          </Link>
        ))}
      </div>

      {/* Totais dos filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex justify-between text-sm">
        <span className="text-gray-500">
          {lancamentos.length} lançamento{lancamentos.length !== 1 ? "s" : ""}
        </span>
        <div className="flex gap-4">
          <span className="text-green-600 font-medium">
            +{formatBRL(totalEntradas)}
          </span>
          <span className="text-red-500 font-medium">
            -{formatBRL(totalSaidas)}
          </span>
        </div>
      </div>

      {/* Lista vazia */}
      {lancamentos.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">Nenhum lançamento encontrado.</p>
        </div>
      )}

      {/* Lista de lançamentos */}
      {lancamentos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
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
                className="flex items-center justify-between px-4 py-3"
              >
                {/* Ícone + descrição */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isEntrada ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {isEntrada ? (
                      <TrendingUp size={15} className="text-green-500" />
                    ) : (
                      <TrendingDown size={15} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                      {item.descricao}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {dataFormatada}
                      </span>
                      {item.categoria && (
                        <span className="text-xs text-gray-400">
                          · {item.categoria}
                        </span>
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          item.carteira === "negocio"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.carteira === "negocio" ? "Negócio" : "Pessoal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Valor + deletar */}
                <div className="flex items-center gap-3 shrink-0">
                  <p
                    className={`text-sm font-semibold ${
                      isEntrada ? "text-green-600" : "text-red-500"
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
