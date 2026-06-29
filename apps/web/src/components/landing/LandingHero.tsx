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
      {/* Background image — direita para esquerda em degradê */}
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src="/hero_dokei.jpg"
          alt=""
          fill
          className="object-cover object-right"
          priority
        />
        {/* Degradê: transparente na direita, sólido na esquerda */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4b6d2a] via-[#7ba23f]/85 to-[#7ba23f]/20" />
      </div>

      {/* Blobs originais — apenas mobile (sem imagem) */}
      <div className="absolute inset-0 opacity-10 sm:hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div
          className={`text-left max-w-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8 sm:mb-10">
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={400}
              height={100}
              className="w-64 sm:w-80 lg:w-96 h-auto mx-auto object-contain drop-shadow-[0_4px_40px_rgba(27,94,32,0.8)] [filter:brightness(0)_saturate(100%)_invert(15%)_sepia(100%)_saturate(700%)_hue-rotate(86deg)_brightness(90%)]"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Gestão simples para MEI
          </h1>
          <p className="text-lg sm:text-xl text-white mb-10 sm:mb-12 max-w-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Chega de planilhas confusas e burocracia. Organize seu negócio,
            emita recibos e mantenha suas obrigações em dia — tudo em um só
            lugar.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-start gap-4 mb-12 sm:mb-16">
            <Link
              href="/cadastro"
              className="group inline-flex items-center justify-center bg-emerald-800 text-white hover:bg-emerald-900 font-semibold px-6 py-3 sm:px-8 sm:py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#7ba23f] transition duration-300"
            >
              <span>Começar grátis</span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-6 py-3 sm:px-8 sm:py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#7ba23f] transition duration-300"
            >
              <span>Já tenho conta</span>
            </Link>
          </div>
          <div className="hidden sm:block">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
              <div className="flex items-start gap-2">
                <CheckCircle
                  size={20}
                  className="text-emerald-500 mt-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
                />
                <div>
                  <p className="font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                    100% Gratuito
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle
                  size={20}
                  className="text-emerald-500 mt-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
                />
                <div>
                  <p className="font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                    Dashboard Intuitivo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle
                  size={20}
                  className="text-emerald-500 mt-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
                />
                <div>
                  <p className="font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                    Fácil de usar
                  </p>
                </div>
              </div>
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
