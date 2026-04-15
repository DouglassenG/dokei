"use client"

import { ExternalLink } from "lucide-react"

/**
 * BotaoDeclarar — Client Component
 * Abre o portal gov.br para fazer a declaração DASN-SIMEI
 */
export function BotaoDeclarar() {
  return (
    <button
      onClick={() =>
        window.open(
          "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/declaracao-anual-do-simei",
          "_blank",
        )
      }
      className="flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] px-6 py-3 rounded-lg text-sm font-medium transition-colors"
    >
      <ExternalLink size={16} />
      Fazer declaração no gov.br
    </button>
  )
}
