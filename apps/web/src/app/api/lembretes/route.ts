import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/lembretes
 * Lista todos os lembretes do usuário logado ordenados por vencimento.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const lembretes = await prisma.lembrete.findMany({
      where: { userId: user.id },
      orderBy: { vencimento: "asc" },
    })

    return NextResponse.json(lembretes, { status: 200 })
  } catch (error) {
    console.error("[GET /api/lembretes]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/lembretes/[id]
 * Marca um lembrete como concluído.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const body = await request.json()
    const { id, status } = body

    const lembrete = await prisma.lembrete.findFirst({
      where: { id, userId: user.id },
    })

    if (!lembrete) {
      return NextResponse.json(
        { error: "Lembrete não encontrado." },
        { status: 404 },
      )
    }

    const atualizado = await prisma.lembrete.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(atualizado, { status: 200 })
  } catch (error) {
    console.error("[PATCH /api/lembretes]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
