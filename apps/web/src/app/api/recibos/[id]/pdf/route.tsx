import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { ReciboPDF } from "@/components/pdf/ReciboPDF"

/**
 * GET /api/recibos/[id]/pdf
 *
 * Gera e retorna o PDF do recibo como stream de bytes.
 * Gerado no servidor — garante consistência em qualquer dispositivo.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // ─── 1. Verificar sessão ─────────────────────────────────────────────
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // ─── 2. Buscar recibo no banco ───────────────────────────────────────
    const recibo = await prisma.documento.findFirst({
      where: { id, userId: user.id, tipo: "recibo" },
    })

    if (!recibo) {
      return NextResponse.json(
        { error: "Recibo não encontrado" },
        { status: 404 },
      )
    }

    // ─── 3. Buscar dados do prestador ────────────────────────────────────
    const userDb = await prisma.user.findUnique({
      where: { id: user.id },
      select: { nome: true, plano: true },
    })

    const nomePrestador = userDb?.nome ?? user.email ?? "Prestador"
    const plano = userDb?.plano ?? "gratis"

    const dados = recibo.dadosJson as {
      nomeCliente: string
      servicoDescricao: string
      valor: number
      formaPagamento: string
      data: string
      observacoes?: string
    }

    // ─── 4. Gerar PDF usando JSX direto (arquivo .tsx) ───────────────────
    // renderToBuffer aceita um elemento React — usando JSX em vez de createElement
    const pdfBuffer = await renderToBuffer(
      <ReciboPDF
        numero={recibo.numero ?? "DOK-0000"}
        dados={dados}
        nomePrestador={nomePrestador}
        plano={plano}
      />,
    )

    // ─── 5. Retornar como download ───────────────────────────────────────
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="recibo-${recibo.numero}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[GET /api/recibos/[id]/pdf]", error)
    return NextResponse.json({ error: "Erro ao gerar PDF." }, { status: 500 })
  }
}
