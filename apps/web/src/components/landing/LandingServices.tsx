"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  FileSpreadsheet,
} from "lucide-react"
import Image from "next/image"

const services = [
  {
    icon: FileText,
    title: "Emitir Recibo",
    description:
      "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp com apenas alguns cliques.",
  },
  {
    icon: TrendingUp,
    title: "Controle Financeiro",
    description:
      "Registre entradas e saídas separando negócio do pessoal. Visualize sua saúde financeira de forma clara.",
  },
  {
    icon: Bell,
    title: "Lembretes DAS",
    description:
      "Nunca perca o prazo do seu DAS e obrigações fiscais. Receba alertas automáticos antes do vencimento.",
  },
  {
    icon: Calculator,
    title: "Calculadora de Preço",
    description:
      "Descubra quanto cobrar pelo seu serviço em 30 segundos. Precifique com confiança e lucre mais.",
  },
  {
    icon: FileSpreadsheet,
    title: "Declaração de Rendimentos",
    description:
      "Veja quanto movimentou no ano e declare seu faturamento MEI sem complicações.",
  },
]

export function LandingServices() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(services.length).fill(false),
  )
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardsRef.current.forEach((card, index) => {
      if (card) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              setVisibleCards((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }
          },
          { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
        )
        observer.observe(card)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <section
      id="servicos"
      className="relative py-20 lg:py-28 overflow-hidden bg-[#1a4d2e]"
    >
      {/* Background image com overlay */}
      <div className="absolute inset-0">
        <Image
          src="/features_dokei.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4d2e] via-[#1a4d2e]/80 to-[#1a4d2e]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Tudo que você precisa para gerir seu MEI
          </h2>
          <p className="text-lg text-white/70 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            Ferramentas simples e poderosas pensadas especialmente para quem
            empreende sozinho. Foque no que importa: fazer seu negócio crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className={`transition-all duration-700 ease-out ${
                visibleCards[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-xl hover:bg-white/20 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="w-14 h-14 bg-[#7ba23f]/20 border border-[#7ba23f]/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-[#7ba23f] drop-shadow-[0_0_6px_rgba(123,162,63,0.5)]" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#7ba23f] transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    {service.title}
                  </h3>

                  <p className="text-white/70 leading-relaxed mb-4">
                    {service.description}
                  </p>


                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
