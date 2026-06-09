import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="light min-h-screen flex items-center justify-center bg-[#8BC34A] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      style={{ colorScheme: "light" }}
    >
      <div className="w-full max-w-[24rem] sm:max-w-[27.72rem] lg:max-w-[31.68rem] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-[#1B5E20]" />
        <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <div className="mb-3 sm:mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              <ArrowLeft size={15} />
              Voltar ao site
            </Link>
          </div>

          <div className="mb-6 sm:mb-8 flex flex-col items-center">
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={180}
              height={40}
              className="h-10 w-auto sm:h-12 lg:h-14 object-contain"
              priority
            />
            <p className="text-xs sm:text-sm lg:text-base text-[#2E7D32] mt-2">
              Gestão simples para MEI
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
