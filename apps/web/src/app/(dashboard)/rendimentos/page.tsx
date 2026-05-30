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
 * Pagina de Declaracao de Rendimentos
 *
 * Exibe:
 * 1. Totais do ano (entradas, saidas, saldo)
 * 2. Grafico mensal de entradas vs saidas
 * 3. Historico mes a mes
 * 4. Botao para ir ao gov.br fazer a declaracao
 */

export default async function RendimentosPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>
}) {
  const params = await searchParams
  const anoAtual = new Date().getFullYear()
  const ano = Number(params.ano ?? anoAtual)

  // Verificar sessao
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const inicioAno = new Date(ano, 0, 1)
  const fimAno = new Date(ano, 11, 31, 23, 59, 59)

  // Busca lancamentos do ano — apenas carteira negocio
  const lancamentos = await prisma.financeiro.findMany({
    where: {
      userId: user.id,
      carteira: "negocio",
      data: { gte: inicioAno, lte: fimAno },
    },
    select: { tipo: true, valor: true, data: true },
    orderBy: { data: "asc" },
  })

  // Agrupa por mes
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Marco",
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

  // Meses com movimento para a tabela historico
  const mesesComMovimento = meses.filter((m) => m.entradas > 0 || m.saidas > 0)

  return (
    <div className="space-y-6 pb-10">
      {/* Cabecalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Declaracao de Rendimentos
          </h1>
          <p className="text-sm text-gray-500">
            Carteira Negocio — base para sua declaracao MEI
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <p className="text-xs text-gray-400">Saidas</p>
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

      {/* Grafico mensal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Movimentacao Mensal {ano}
        </h2>
        <GraficoRendimentos meses={meses} />
      </div>

      {/* Historico mes a mes */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Historico por Mes
          </h2>
        </div>

        {mesesComMovimento.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-500">
              Nenhum lancamento registrado em {ano}.
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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-100 last:border-0 gap-2 sm:gap-0"
          >
            <p className="text-sm font-medium text-gray-900 sm:w-28">
              {m.nomeMes}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">Entradas</p>
                <p className="text-sm font-medium text-green-600">
                  {formatBRL(m.entradas)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Saidas</p>
                <p className="text-sm font-medium text-red-500">
                  {formatBRL(m.saidas)}
                </p>
              </div>
              <div className="text-right sm:w-24">
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

      {/* CTA — ir para a declaracao */}
      <div className="bg-[#1B5E20]/5 rounded-2xl border border-[#1B5E20]/10 p-4 sm:p-6 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Pronto para fazer sua declaracao?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Use os valores acima como base para preencher a DASN-SIMEI no portal
            do governo. O total de entradas da carteira Negocio e o seu
            faturamento bruto anual.
          </p>
        </div>
        <BotaoDeclarar />
      </div>
    </div>
  )
}
