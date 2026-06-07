import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth" // CLERK
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // ─── 1. Verificar sessao via Clerk ────────────────────────────────────
    const user = await getAuthUser() // CLERK

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // ─── 2. Garantir que o usuario existe na tabela users ─────────────────
    const usuarioExiste = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!usuarioExiste) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          plano: "gratis",
        },
      })
    }

    // ─── 3. Validar campos obrigatorios ────────────────────────────────────
    const body = await request.json()
    const {
      nomeCliente,
      servicoDescricao,
      valor,
      formaPagamento,
      data,
      observacoes,
    } = body

    if (
      !nomeCliente ||
      !servicoDescricao ||
      !valor ||
      !formaPagamento ||
      !data
    ) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      )
    }

    if (isNaN(Number(valor)) || Number(valor) <= 0) {
      return NextResponse.json({ error: "Valor inválido." }, { status: 400 })
    }

    // ─── 4. Verificar limite do plano gratis (5 recibos/mes) ──────────────
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    // ─── 5. Gerar numero sequencial DOK-0001 ──────────────────────────────
    const ultimoRecibo = await prisma.documento.findFirst({
      where: { userId: user.id, tipo: "recibo" },
      orderBy: { criadoEm: "desc" },
      select: { numero: true },
    })

    const ultimoNumero = ultimoRecibo?.numero
      ? parseInt(ultimoRecibo.numero.replace("DOK-", ""), 10)
      : 0

    const novoNumero = String(ultimoNumero + 1).padStart(4, "0")
    const numero = `DOK-${novoNumero}`

    // ─── 6. Salvar no banco ───────────────────────────────────────────────
    const recibo = await prisma.documento.create({
      data: {
        userId: user.id,
        tipo: "recibo",
        numero,
        status: "ativo",
        dadosJson: {
          nomeCliente,
          servicoDescricao,
          valor: Number(valor),
          formaPagamento,
          data,
          observacoes: observacoes ?? "",
        },
      },
    })

    // ─── 7. Retornar o id para o frontend redirecionar ────────────────────
    return NextResponse.json({ id: recibo.id, numero }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/recibos]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const user = await getAuthUser() // CLERK

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const recibos = await prisma.documento.findMany({
      where: { userId: user.id, tipo: "recibo" },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        numero: true,
        status: true,
        criadoEm: true,
        dadosJson: true,
      },
    })

    return NextResponse.json(recibos, { status: 200 })
  } catch (error) {
    console.error("[GET /api/recibos]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}
