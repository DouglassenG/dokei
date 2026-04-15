import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * DELETE /api/financeiro/[id]
 * Exclui um lançamento financeiro do usuário logado.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verifica se o lançamento pertence ao usuário antes de deletar
    const lancamento = await prisma.financeiro.findFirst({
      where: { id, userId: user.id },
    })

    if (!lancamento) {
      return NextResponse.json(
        { error: "Lançamento não encontrado." },
        { status: 404 },
      )
    }

    await prisma.financeiro.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[DELETE /api/financeiro/[id]]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/financeiro/[id]
 * Atualiza um lançamento financeiro do usuário logado.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verifica se o lançamento pertence ao usuário
    const lancamento = await prisma.financeiro.findFirst({
      where: { id, userId: user.id },
    })

    if (!lancamento) {
      return NextResponse.json(
        { error: "Lançamento não encontrado." },
        { status: 404 },
      )
    }

    const body = await request.json()
    const { tipo, categoria, descricao, valor, carteira, data } = body

    const atualizado = await prisma.financeiro.update({
      where: { id },
      data: {
        ...(tipo ? { tipo } : {}),
        ...(categoria !== undefined ? { categoria } : {}),
        ...(descricao ? { descricao } : {}),
        ...(valor ? { valor: Number(valor) } : {}),
        ...(carteira ? { carteira } : {}),
        ...(data ? { data: new Date(data) } : {}),
      },
    })

    return NextResponse.json(atualizado, { status: 200 })
  } catch (error) {
    console.error("[PATCH /api/financeiro/[id]]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
