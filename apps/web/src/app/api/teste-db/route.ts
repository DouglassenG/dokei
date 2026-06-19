import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const resultado = await prisma.$queryRaw`SELECT 1 as ok`
    return NextResponse.json({ status: "conectado", resultado })
  } catch (error: unknown) {
    const mensagem = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ status: "erro", mensagem }, { status: 500 })
  }
}
