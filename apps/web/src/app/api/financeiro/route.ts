import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/financeiro
 * Lista todos os lançamentos do usuário logado.
 * Ordenado do mais recente para o mais antigo.
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

    // Lê filtros opcionais da URL
    // Ex: /api/financeiro?carteira=negocio&tipo=entrada
    const { searchParams } = new URL(request.url)
    const carteira = searchParams.get("carteira")
    const tipo = searchParams.get("tipo")

    const lancamentos = await prisma.financeiro.findMany({
      where: {
        userId: user.id,
        // Aplica filtros apenas se fornecidos
        ...(carteira && carteira !== "todos" ? { carteira } : {}),
        ...(tipo && tipo !== "todos" ? { tipo } : {}),
      },
      orderBy: { data: "desc" },
    })

    return NextResponse.json(lancamentos, { status: 200 })
  } catch (error) {
    console.error("[GET /api/financeiro]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}

/**
 * POST /api/financeiro
 * Cria um novo lançamento financeiro para o usuário logado.
 *
 * Body esperado:
 * {
 *   tipo: "entrada" | "saida"
 *   categoria: string
 *   descricao: string
 *   valor: number
 *   carteira: "negocio" | "pessoal"
 *   data: string (YYYY-MM-DD)
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, categoria, descricao, valor, carteira, data } = body

    // Valida campos obrigatórios
    if (!tipo || !descricao || !valor || !data) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      )
    }

    if (!["entrada", "saida"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use 'entrada' ou 'saida'." },
        { status: 400 },
      )
    }

    if (isNaN(Number(valor)) || Number(valor) <= 0) {
      return NextResponse.json({ error: "Valor inválido." }, { status: 400 })
    }

    // Garante que o usuário existe na tabela users
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

    const lancamento = await prisma.financeiro.create({
      data: {
        userId: user.id,
        tipo,
        categoria: categoria ?? null,
        descricao,
        valor: Number(valor),
        carteira: carteira ?? "negocio",
        data: new Date(data),
      },
    })

    return NextResponse.json(lancamento, { status: 201 })
  } catch (error) {
    console.error("[POST /api/financeiro]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
