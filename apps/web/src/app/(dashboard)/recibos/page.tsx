import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Plus, ChevronRight } from "lucide-react"

/**
 * Tipagem dos dados armazenados no dadosJson do recibo
 */
interface DadosRecibo {
  nomeCliente: string
  valor: number
  formaPagamento: string
  data: string
}

export default async function RecibosPage() {
  // ─── Verificar sessão ──────────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // ─── Buscar recibos do usuário ─────────────────────────────────────────
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

  // Formata valor para BRL
  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-[#1B5E20]" />
          <h1 className="text-xl font-bold text-gray-900">Meus Recibos</h1>
        </div>
        <Link
          href="/recibos/novo"
          className="flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Novo recibo
        </Link>
      </div>

      {/* Lista vazia */}
      {recibos.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
          <FileText size={40} className="text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">
            Nenhum recibo emitido ainda
          </p>
          <p className="text-sm text-gray-400">
            Crie seu primeiro recibo e compartilhe pelo WhatsApp.
          </p>
          <Link
            href="/recibos/novo"
            className="inline-flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2"
          >
            <Plus size={16} />
            Criar primeiro recibo
          </Link>
        </div>
      )}

      {/* Lista de recibos */}
      {recibos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {recibos.map((recibo) => {
            const dados = recibo.dadosJson as unknown as DadosRecibo
            const dataFormatada = new Date(recibo.criadoEm).toLocaleDateString(
              "pt-BR",
            )

            return (
              <Link
                key={recibo.id}
                href={`/recibos/${recibo.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Lado esquerdo — número e cliente */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#1B5E20]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {recibo.numero}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dados?.nomeCliente ?? "Cliente não informado"}
                    </p>
                  </div>
                </div>

                {/* Lado direito — valor e data */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1B5E20]">
                      {formatBRL(dados?.valor ?? 0)}
                    </p>
                    <p className="text-xs text-gray-400">{dataFormatada}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
