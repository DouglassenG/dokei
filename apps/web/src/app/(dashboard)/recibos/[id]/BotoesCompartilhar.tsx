"use client"

import { Share2, Download } from "lucide-react"

interface BotoesCompartilharProps {
  msgWhatsApp: string
  linkPdf: string
}

export function BotoesCompartilhar({
  msgWhatsApp,
  linkPdf,
}: BotoesCompartilharProps) {
  function abrirWhatsApp() {
    window.open(`https://wa.me/?text=${msgWhatsApp}`, "_blank")
  }

  function baixarPdf() {
    window.open(linkPdf, "_blank")
  }

  return (
    <div className="space-y-3">
      <button
        onClick={abrirWhatsApp}
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5d] py-3 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        <Share2 size={18} />
        Compartilhar no WhatsApp
      </button>

      <button
        onClick={baixarPdf}
        className="w-full flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        <Download size={18} />
        Baixar PDF
      </button>
    </div>
  )
}
