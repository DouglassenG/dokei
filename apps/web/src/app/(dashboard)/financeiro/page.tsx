import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  User,
  ChevronRight,
} from "lucide-react"
import { LancamentoRapido } from "./LancamentoRapido"

interface Resumo {
  totalEntradas: number
  totalSaidas: number
  saldo: number
  negocio: { entradas: number; saidas: number }
  pessoal: { entradas: number; saidas: number }
}

export default async function FinanceiroPage() {
  // --- Verificar sessao ---
  const user = await getAuthUser()
  if (!user) return null
  // --- Buscar resumo do mes ---
  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const fimMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
    23,
    59,
    59,
  )

  const filtroBase = {
    userId: user.id,
    data: { gte: inicioMes, lte: fimMes },
  }

  // Executa todas as queries em paralelo para melhor performance
  const [
    entradasNegocio,
    saidasNegocio,
    entradasPessoal,
    saidasPessoal,
    ultimosLancamentos,
  ] = await Promise.all([
    prisma.financeiro.aggregate({
      _sum: { valor: true },
      where: { ...filtroBase, tipo: "entrada", carteira: "negocio" },
    }),
    prisma.financeiro.aggregate({
      _sum: { valor: true },
      where: { ...filtroBase, tipo: "saida", carteira: "negocio" },
    }),
    prisma.financeiro.aggregate({
      _sum: { valor: true },
      where: { ...filtroBase, tipo: "entrada", carteira: "pessoal" },
    }),
    prisma.financeiro.aggregate({
      _sum: { valor: true },
      where: { ...filtroBase, tipo: "saida", carteira: "pessoal" },
    }),
    // Ultimos 10 lancamentos para o feed
    prisma.financeiro.findMany({
      where: { userId: user.id },
      orderBy: { data: "desc" },
      take: 10,
    }),
  ])

  // Converte Decimal do Prisma para number
  const toNumber = (val: unknown) => Number(val ?? 0)

  const resumo: Resumo = {
    totalEntradas:
      toNumber(entradasNegocio._sum.valor) +
      toNumber(entradasPessoal._sum.valor),
    totalSaidas:
      toNumber(saidasNegocio._sum.valor) + toNumber(saidasPessoal._sum.valor),
    saldo:
      toNumber(entradasNegocio._sum.valor) +
      toNumber(entradasPessoal._sum.valor) -
      toNumber(saidasNegocio._sum.valor) -
      toNumber(saidasPessoal._sum.valor),
    negocio: {
      entradas: toNumber(entradasNegocio._sum.valor),
      saidas: toNumber(saidasNegocio._sum.valor),
    },
    pessoal: {
      entradas: toNumber(entradasPessoal._sum.valor),
      saidas: toNumber(saidasPessoal._sum.valor),
    },
  }

  // Formata valor para BRL
  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Nome do mes atual
  const nomeMes = hoje.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6 pb-24">
      {/* Cabecalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Controle Financeiro
          </h1>
          <p className="text-sm text-gray-500 capitalize">{nomeMes}</p>
        </div>
        <Link
          href="/financeiro/extrato"
          className="flex items-center gap-1 text-sm text-[#1B5E20] hover:underline"
        >
          Ver extrato
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* 3 Cards — entradas, saidas, saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Entradas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-green-500" />
            <p className="text-xs text-gray-400">Entradas</p>
          </div>
          <p className="text-base font-bold text-green-600">
            {formatBRL(resumo.totalEntradas)}
          </p>
        </div>

        {/* Saidas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <TrendingDown size={14} className="text-red-500" />
            <p className="text-xs text-gray-400">Saidas</p>
          </div>
          <p className="text-base font-bold text-red-500">
            {formatBRL(resumo.totalSaidas)}
          </p>
        </div>

        {/* Saldo */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-[#1B5E20]" />
            <p className="text-xs text-gray-400">Saldo</p>
          </div>
          <p
            className={`text-base font-bold ${resumo.saldo >= 0 ? "text-[#1B5E20]" : "text-red-500"}`}
          >
            {formatBRL(resumo.saldo)}
          </p>
        </div>
      </div>

      {/* 2 Carteiras — Negocio e Pessoal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Carteira Negocio */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-blue-600" />
            <p className="text-sm font-semibold text-blue-700">Negocio</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Entradas</span>
              <span className="text-green-600 font-medium">
                {formatBRL(resumo.negocio.entradas)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Saidas</span>
              <span className="text-red-500 font-medium">
                {formatBRL(resumo.negocio.saidas)}
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-blue-100 pt-1 mt-1">
              <span className="text-gray-600 font-medium">Saldo</span>
              <span
                className={`font-bold text-sm ${
                  resumo.negocio.entradas - resumo.negocio.saidas >= 0
                    ? "text-blue-700"
                    : "text-red-500"
                }`}
              >
                {formatBRL(resumo.negocio.entradas - resumo.negocio.saidas)}
              </span>
            </div>
          </div>
        </div>

        {/* Carteira Pessoal */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Pessoal</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Entradas</span>
              <span className="text-green-600 font-medium">
                {formatBRL(resumo.pessoal.entradas)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Saidas</span>
              <span className="text-red-500 font-medium">
                {formatBRL(resumo.pessoal.saidas)}
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-200 pt-1 mt-1">
              <span className="text-gray-600 font-medium">Saldo</span>
              <span
                className={`font-bold text-sm ${
                  resumo.pessoal.entradas - resumo.pessoal.saidas >= 0
                    ? "text-gray-700"
                    : "text-red-500"
                }`}
              >
                {formatBRL(resumo.pessoal.entradas - resumo.pessoal.saidas)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultimos lancamentos */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Ultimos lancamentos
        </h2>

        {/* Lista vazia */}
        {ultimosLancamentos.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-2">
            <DollarSign size={32} className="text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500">Nenhum lancamento ainda</p>
            <p className="text-xs text-gray-400">
              Clique em "Novo lancamento" para comecar.
            </p>
          </div>
        )}

        {/* Lista de lancamentos */}
        {ultimosLancamentos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {ultimosLancamentos.map((item) => {
              const dataFormatada = new Date(item.data).toLocaleDateString(
                "pt-BR",
                {
                  timeZone: "UTC",
                },
              )
              const isEntrada = item.tipo === "entrada"

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 sm:px-4 py-3"
                >
                  {/* Lado esquerdo — icone + descricao */}
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.descricao}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {dataFormatada}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            item.carteira === "negocio"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.carteira === "negocio" ? "Negocio" : "Pessoal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lado direito — valor */}
                  <p
                    className={`text-sm font-semibold shrink-0 ml-3 ${
                      isEntrada ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isEntrada ? "+" : "-"}
                    {formatBRL(Number(item.valor))}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Componente client de lancamento rapido */}
      <LancamentoRapido />
    </div>
  )
}
