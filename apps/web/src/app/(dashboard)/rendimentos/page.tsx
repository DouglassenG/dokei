import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { GraficoRendimentos } from "./GraficoRendimentos"
import { BotaoDeclarar } from "./BotaoDeclarar"

/**
 * Página de Declaração de Rendimentos
 *
 * Exibe:
 * 1. Totais do ano (entradas, saídas, saldo)
 * 2. Gráfico mensal de entradas vs saídas
 * 3. Histórico mês a mês
 * 4. Botão para ir ao gov.br fazer a declaração
 */

export default async function RendimentosPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>
}) {
  const params = await searchParams
  const anoAtual = new Date().getFullYear()
  const ano = Number(params.ano ?? anoAtual)

  // Verificar sessão
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const inicioAno = new Date(ano, 0, 1)
  const fimAno = new Date(ano, 11, 31, 23, 59, 59)

  // Busca lançamentos do ano — apenas carteira negócio
  const lancamentos = await prisma.financeiro.findMany({
    where: {
      userId: user.id,
      carteira: "negocio",
      data: { gte: inicioAno, lte: fimAno },
    },
    select: { tipo: true, valor: true, data: true },
    orderBy: { data: "asc" },
  })

  // Agrupa por mês
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const meses = nomesMeses.map((nomeMes, index) => ({
    mes: index + 1,
    nomeMes,
    entradas: 0,
    saidas: 0,
    saldo: 0,
  }))

  for (const lancamento of lancamentos) {
    const mes = new Date(lancamento.data).getMonth()
    const valor = Number(lancamento.valor)
    const mesDado = meses[mes]

    if (!mesDado) continue

    if (lancamento.tipo === "entrada") {
      mesDado.entradas += valor
    } else {
      mesDado.saidas += valor
    }
    mesDado.saldo = mesDado.entradas - mesDado.saidas
  }

  const totalEntradas = meses.reduce((acc, m) => acc + m.entradas, 0)
  const totalSaidas = meses.reduce((acc, m) => acc + m.saidas, 0)
  const saldoTotal = totalEntradas - totalSaidas

  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Meses com movimento para a tabela histórico
  const mesesComMovimento = meses.filter((m) => m.entradas > 0 || m.saidas > 0)

  return (
    <div className="space-y-6 pb-10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Declaração de Rendimentos
          </h1>
          <p className="text-sm text-gray-500">
            Carteira Negócio — base para sua declaração MEI
          </p>
        </div>
      </div>

      {/* Seletor de ano */}
      <div className="flex items-center justify-center gap-4">
        <Link
          href={`/rendimentos?ano=${ano - 1}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-500" />
        </Link>
        <span className="text-lg font-bold text-gray-900">{ano}</span>
        <Link
          href={`/rendimentos?ano=${ano + 1}`}
          className={`p-2 rounded-lg transition-colors ${
            ano >= anoAtual
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <ChevronRight size={20} className="text-gray-500" />
        </Link>
      </div>

      {/* 3 Cards totais do ano */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-green-500" />
            <p className="text-xs text-gray-400">Entradas</p>
          </div>
          <p className="text-sm font-bold text-green-600">
            {formatBRL(totalEntradas)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <TrendingDown size={14} className="text-red-500" />
            <p className="text-xs text-gray-400">Saídas</p>
          </div>
          <p className="text-sm font-bold text-red-500">
            {formatBRL(totalSaidas)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-[#1B5E20]" />
            <p className="text-xs text-gray-400">Saldo</p>
          </div>
          <p
            className={`text-sm font-bold ${saldoTotal >= 0 ? "text-[#1B5E20]" : "text-red-500"}`}
          >
            {formatBRL(saldoTotal)}
          </p>
        </div>
      </div>

      {/* Gráfico mensal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Movimentação Mensal {ano}
        </h2>
        <GraficoRendimentos meses={meses} />
      </div>

      {/* Histórico mês a mês */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Histórico por Mês
          </h2>
        </div>

        {mesesComMovimento.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-500">
              Nenhum lançamento registrado em {ano}.
            </p>
            <Link
              href="/financeiro"
              className="text-sm text-[#1B5E20] hover:underline mt-2 inline-block"
            >
              Ir para o Controle Financeiro
            </Link>
          </div>
        )}

        {mesesComMovimento.map((m) => (
          <div
            key={m.mes}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0"
          >
            <p className="text-sm font-medium text-gray-900 w-28">
              {m.nomeMes}
            </p>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">Entradas</p>
                <p className="text-sm font-medium text-green-600">
                  {formatBRL(m.entradas)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Saídas</p>
                <p className="text-sm font-medium text-red-500">
                  {formatBRL(m.saidas)}
                </p>
              </div>
              <div className="text-right w-24">
                <p className="text-xs text-gray-400">Saldo</p>
                <p
                  className={`text-sm font-bold ${m.saldo >= 0 ? "text-[#1B5E20]" : "text-red-500"}`}
                >
                  {formatBRL(m.saldo)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA — ir para a declaração */}
      <div className="bg-[#1B5E20]/5 rounded-2xl border border-[#1B5E20]/10 p-6 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Pronto para fazer sua declaração?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Use os valores acima como base para preencher a DASN-SIMEI no portal
            do governo. O total de entradas da carteira Negócio é o seu
            faturamento bruto anual.
          </p>
        </div>
        <BotaoDeclarar />
      </div>
    </div>
  )
}
