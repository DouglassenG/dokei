import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/lembretes/gerar
 *
 * Chamado pelo Vercel Cron todo dia 1 de cada mês às 8h.
 * Gera automaticamente os lembretes de DAS e DASN para todos os usuários ativos.
 *
 * Protegido por CRON_SECRET para evitar chamadas não autorizadas.
 */
export async function GET(request: Request) {
  try {
    // Verifica o token secreto do cron
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const hoje = new Date()
    const mes = hoje.getMonth()
    const ano = hoje.getFullYear()

    // Vencimento do DAS — todo dia 20 do mês atual
    const vencimentoDAS = new Date(ano, mes, 20)

    // Busca todos os usuários ativos
    const usuarios = await prisma.user.findMany({
      select: { id: true },
    })

    let criados = 0

    for (const user of usuarios) {
      // Verifica se o DAS deste mês já foi criado para evitar duplicatas
      const dasExistente = await prisma.lembrete.findFirst({
        where: {
          userId: user.id,
          tipo: "DAS",
          vencimento: vencimentoDAS,
        },
      })

      if (!dasExistente) {
        await prisma.lembrete.create({
          data: {
            userId: user.id,
            tipo: "DAS",
            descricao:
              "Pagamento do DAS — contribuição mensal MEI (INSS + imposto).",
            vencimento: vencimentoDAS,
            status: "pendente",
          },
        })
        criados++
      }

      // Cria lembrete da DASN apenas em janeiro (declaração anual vence 31/05)
      if (mes === 0) {
        const vencimentoDASN = new Date(ano, 4, 31) // 31 de maio
        const dasnExistente = await prisma.lembrete.findFirst({
          where: {
            userId: user.id,
            tipo: "DASN",
            vencimento: vencimentoDASN,
          },
        })

        if (!dasnExistente) {
          await prisma.lembrete.create({
            data: {
              userId: user.id,
              tipo: "DASN",
              descricao:
                "Declaração Anual do MEI (DASN-SIMEI) — informe o faturamento do ano anterior. Grátis, mas multa alta por não entregar.",
              vencimento: vencimentoDASN,
              status: "pendente",
            },
          })
          criados++
        }
      }
    }

    return NextResponse.json(
      {
        ok: true,
        criados,
        usuarios: usuarios.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[GET /api/lembretes/gerar]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
