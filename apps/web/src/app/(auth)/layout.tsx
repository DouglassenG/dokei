import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8BC34A] px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="h-1 bg-[#1B5E20]" />
        <div className="p-8">
          {/* Botao voltar ao site */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              <ArrowLeft size={15} />
              Voltar ao site
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1B5E20]">Dokei</h1>
            <p className="text-sm text-[#2E7D32] mt-1">
              Gestao simples para MEI
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
