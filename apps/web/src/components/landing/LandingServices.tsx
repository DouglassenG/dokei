"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react"

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
    new Array(services.length).fill(false)
  )
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardsRef.current.forEach((card, index) => {
      if (card) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }
          },
          { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        )
        observer.observe(card)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <section id="servicos" className="py-20 lg:py-28 bg-[#f4f7f0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a4d2e] mb-6 text-balance">
            Tudo que você precisa para gerir seu MEI
          </h2>
          <p className="text-lg text-[#4a6741] leading-relaxed">
            Ferramentas simples e poderosas pensadas especialmente para quem empreende sozinho. Foque no que importa: fazer seu negócio crescer.
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
              <Card className="h-full bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="w-14 h-14 bg-[#1a4d2e] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-[#1a4d2e] mb-3 group-hover:text-[#7ba23f] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-[#4a6741] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center text-[#7ba23f] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Saiba mais</span>
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
