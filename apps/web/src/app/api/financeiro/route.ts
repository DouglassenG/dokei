import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth" // CLERK
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser() // CLERK

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const carteira = searchParams.get("carteira")
    const tipo = searchParams.get("tipo")

    const lancamentos = await prisma.financeiro.findMany({
      where: {
        userId: user.id,
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

export async function POST(request: Request) {
  try {
    const user = await getAuthUser() // CLERK

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, categoria, descricao, valor, carteira, data } = body

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

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email, // CLERK
        nome: user.nome, // CLERK
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
