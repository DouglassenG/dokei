import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/rendimentos?ano=2026
 *
 * Retorna os rendimentos agrupados por mês do ano solicitado.
 * Usado pela página de Declaração de Rendimentos.
 *
 * Retorna:
 * {
 *   ano: number
 *   totalEntradas: number
 *   totalSaidas: number
 *   meses: Array<{
 *     mes: number
 *     nomeMes: string
 *     entradas: number
 *     saidas: number
 *     saldo: number
 *   }>
 * }
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Lê o ano da URL — padrão é o ano atual
    const { searchParams } = new URL(request.url)
    const ano = Number(searchParams.get("ano") ?? new Date().getFullYear())

    const inicioAno = new Date(ano, 0, 1)
    const fimAno = new Date(ano, 11, 31, 23, 59, 59)

    // Busca todos os lançamentos do ano — apenas carteira negócio
    // Rendimentos do MEI são apenas os da carteira de negócio
    const lancamentos = await prisma.financeiro.findMany({
      where: {
        userId: user.id,
        carteira: "negocio",
        data: { gte: inicioAno, lte: fimAno },
      },
      select: {
        tipo: true,
        valor: true,
        data: true,
      },
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

    // Inicializa todos os 12 meses com zero
    const meses = nomesMeses.map((nomeMes, index) => ({
      mes: index + 1,
      nomeMes,
      entradas: 0,
      saidas: 0,
      saldo: 0,
    }))

    // Distribui os lançamentos nos meses corretos
    for (const lancamento of lancamentos) {
      const mes = new Date(lancamento.data).getMonth()
      const valor = Number(lancamento.valor)
      const mesDado = meses[mes]

      // mesDado sempre existe pois meses tem 12 posições (0-11)
      if (!mesDado) continue

      if (lancamento.tipo === "entrada") {
        mesDado.entradas += valor
      } else {
        mesDado.saidas += valor
      }
      mesDado.saldo = mesDado.entradas - mesDado.saidas
    }

    // Totais do ano
    const totalEntradas = meses.reduce((acc, m) => acc + m.entradas, 0)
    const totalSaidas = meses.reduce((acc, m) => acc + m.saidas, 0)

    return NextResponse.json(
      {
        ano,
        totalEntradas,
        totalSaidas,
        saldo: totalEntradas - totalSaidas,
        meses,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[GET /api/rendimentos]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
