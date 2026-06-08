import { getAuthUser } from "@/lib/auth"
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
  // --- Verificar sessao ---
  const user = await getAuthUser()
  if (!user) return null

  // --- Buscar recibos do usuario ---
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
      {/* Cabecalho */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-[#1B5E20] dark:text-[#8BC34A]" />
          <h1 className="text-xl font-bold text-foreground">Meus Recibos</h1>
        </div>
        <Link
          href="/recibos/novo"
          className="flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Novo recibo</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      {/* Lista vazia */}
      {recibos.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center space-y-3">
          <FileText size={40} className="text-muted-foreground/50 mx-auto" />
          <p className="text-muted-foreground font-medium">
            Nenhum recibo emitido ainda
          </p>
          <p className="text-sm text-muted-foreground/70">
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
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {recibos.map((recibo) => {
            const dados = recibo.dadosJson as unknown as DadosRecibo
            const dataFormatada = new Date(recibo.criadoEm).toLocaleDateString(
              "pt-BR",
            )

            return (
              <Link
                key={recibo.id}
                href={`/recibos/${recibo.id}`}
                className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-muted transition-colors"
              >
                {/* Lado esquerdo — numero e cliente */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 bg-[#1B5E20]/10 dark:bg-[#8BC34A]/15 rounded-xl flex items-center justify-center shrink-0">
                    <FileText
                      size={18}
                      className="text-[#1B5E20] dark:text-[#8BC34A]"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {recibo.numero}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {dados?.nomeCliente ?? "Cliente nao informado"}
                    </p>
                  </div>
                </div>

                {/* Lado direito — valor e data */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1B5E20] dark:text-[#8BC34A]">
                      {formatBRL(dados?.valor ?? 0)}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {dataFormatada}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground/70 hidden sm:block"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
