import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/recibos
 *
 * Cria um novo recibo no banco para o usuário logado.
 *
 * Fluxo:
 * 1. Verifica sessão do usuário
 * 2. Valida os campos obrigatórios
 * 3. Gera o número sequencial (DOK-0001, DOK-0002...)
 * 4. Verifica limite do plano grátis (5 recibos/mês)
 * 5. Salva no banco como Documento com tipo='recibo'
 * 6. Retorna o id gerado para redirecionar o frontend
 */
export async function POST(request: Request) {
  try {
    // ─── 1. Verificar sessão ───────────────────────────────────────────────
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // ─── 2. Validar campos obrigatórios ────────────────────────────────────
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

    // ─── 3. Verificar limite do plano grátis (5 recibos/mês) ──────────────
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const totalMes = await prisma.documento.count({
      where: {
        userId: user.id,
        tipo: "recibo",
        criadoEm: { gte: inicioMes },
      },
    })

    // Busca o plano do usuário na tabela users
    const userDb = await prisma.user.findUnique({
      where: { id: user.id },
      select: { plano: true },
    })

    // Bloqueia se plano grátis e já tem 5 recibos no mês
    if ((userDb?.plano ?? "gratis") === "gratis" && totalMes >= 5) {
      return NextResponse.json({ error: "LIMITE_ATINGIDO" }, { status: 403 })
    }

    // ─── 4. Gerar número sequencial DOK-0001 ──────────────────────────────
    const ultimoRecibo = await prisma.documento.findFirst({
      where: { userId: user.id, tipo: "recibo" },
      orderBy: { criadoEm: "desc" },
      select: { numero: true },
    })

    // Extrai o número do último recibo e incrementa
    // Ex: "DOK-0003" → 3 → próximo é 4 → "DOK-0004"
    const ultimoNumero = ultimoRecibo?.numero
      ? parseInt(ultimoRecibo.numero.replace("DOK-", ""), 10)
      : 0

    const novoNumero = String(ultimoNumero + 1).padStart(4, "0")
    const numero = `DOK-${novoNumero}`

    // ─── 5. Salvar no banco ───────────────────────────────────────────────
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

    // ─── 6. Retornar o id para o frontend redirecionar ────────────────────
    return NextResponse.json({ id: recibo.id, numero }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/recibos]", error)
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    )
  }
}

/**
 * GET /api/recibos
 *
 * Lista todos os recibos do usuário logado.
 * Ordenado do mais recente para o mais antigo.
 */
export async function GET() {
  try {
    // Verifica sessão
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Busca todos os recibos do usuário ordenados por data
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
