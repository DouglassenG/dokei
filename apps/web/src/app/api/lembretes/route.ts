import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth" // CLERK
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getAuthUser() // CLERK
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

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser() // CLERK
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
