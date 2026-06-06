import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/financeiro/resumo
 *
 * Retorna os totais do mês atual separados por tipo e carteira.
 * Usado pelos 3 cards do dashboard financeiro.
 *
 * Retorna:
 * {
 *   totalEntradas: number
 *   totalSaidas: number
 *   saldo: number
 *   negocio: { entradas: number, saidas: number }
 *   pessoal: { entradas: number, saidas: number }
 * }
 */
export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Define o intervalo do mês atual
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

    // Busca totais agrupados por tipo e carteira em paralelo
    // Promise.all executa as 4 queries ao mesmo tempo — mais rápido
    const [entradasNegocio, saidasNegocio, entradasPessoal, saidasPessoal] =
      await Promise.all([
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
      ])

    // Converte Decimal do Prisma para number — evita erros de serialização JSON
    const toNumber = (val: unknown) => Number(val ?? 0)

    const totalEntradas =
      toNumber(entradasNegocio._sum.valor) +
      toNumber(entradasPessoal._sum.valor)

    const totalSaidas =
      toNumber(saidasNegocio._sum.valor) + toNumber(saidasPessoal._sum.valor)

    return NextResponse.json(
      {
        totalEntradas,
        totalSaidas,
        saldo: totalEntradas - totalSaidas,
        negocio: {
          entradas: toNumber(entradasNegocio._sum.valor),
          saidas: toNumber(saidasNegocio._sum.valor),
        },
        pessoal: {
          entradas: toNumber(entradasPessoal._sum.valor),
          saidas: toNumber(saidasPessoal._sum.valor),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[GET /api/financeiro/resumo]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
