"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function LandingHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#7ba23f] pt-16 lg:pt-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle size={16} />
            <span>+10.000 MEIs já confiam na Dokei</span>
          </div> */}

          <div className="mb-6 flex justify-center">
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={400}
              height={100}
              className="w-64 sm:w-80 lg:w-[480px] h-auto object-contain drop-shadow-[0_4px_32px_rgba(27,94,32,0.7)] [filter:brightness(0)_saturate(100%)_invert(25%)_sepia(76%)_saturate(600%)_hue-rotate(86deg)_brightness(60%)]"
              priority
            />
          </div>

          <p className="text-xl sm:text-2xl lg:text-3xl text-white mb-4 font-medium">
            Gestão simples para MEI
          </p>
          <p className="text-base sm:text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed">
            Chega de planilhas confusas e burocracia. Organize seu negócio,
            emita recibos e mantenha suas obrigações em dia — tudo em um só
            lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center bg-[#1a4d2e] text-white hover:bg-[#15422a] font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Começar grátis
              <ArrowRight
                size={20}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              Já tenho conta
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-white" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-white" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-white" />
              <span>Suporte humanizado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
