import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

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
      <div className="w-full max-w-[27.72rem] lg:max-w-[31.68rem] bg-white rounded-2xl shadow-2xl overflow-hidden">
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

          <div className="mb-6 sm:mb-8 text-center">
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={400}
              height={100}
              className="mx-auto w-32 sm:w-40 lg:w-[480px] h-auto object-contain drop-shadow-[0_4px_32px_rgba(27,94,32,0.7)] [filter:brightness(0)_saturate(100%)_invert(25%)_sepia(76%)_saturate(600%)_hue-rotate(86deg)_brightness(60%)]"
              priority
            />
            <p className="text-xs sm:text-sm lg:text-base text-[#2E7D32] mt-1">
              Gestao simples para MEI
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
