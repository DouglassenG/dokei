"use client"

import { ExternalLink } from "lucide-react"

/**
 * LinksExternos — Client Component
 * Contém os links para gov.br separados do Server Component
 * para evitar corrupção de tags <a> ao copiar/colar
 */

export function LinkDAS() {
  return (
    <button
      onClick={() => window.open("https://gov.br/mei", "_blank")}
      className="flex items-center gap-1 text-xs text-[#1B5E20] hover:underline"
    >
      <ExternalLink size={12} />
      Pagar no gov.br
    </button>
  )
}

export function LinkDASN() {
  return (
    <button
      onClick={() =>
        window.open(
          "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/declaracao-anual-do-simei",
          "_blank",
        )
      }
      className="flex items-center gap-1 text-xs text-[#1B5E20] hover:underline"
    >
      <ExternalLink size={12} />
      Fazer declaração
    </button>
  )
}
