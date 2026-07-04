"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Heart, ShieldCheck } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Nossa Missão",
    description:
      "Simplificar a rotina de quem empreende sozinho, tirando a burocracia do caminho para você focar em fazer seu negócio crescer.",
  },
  {
    icon: Heart,
    title: "100% Gratuito",
    description:
      "Acreditamos que todo MEI merece boas ferramentas de gestão sem pagar por isso. Por isso a Dokei é e continuará sendo gratuita.",
  },
  {
    icon: ShieldCheck,
    title: "Compromisso com Você",
    description:
      "Construímos a Dokei ouvindo quem vive a realidade do MEI todos os dias, sempre priorizando simplicidade e segurança dos seus dados.",
  },
]

export function LandingAbout() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Quem Somos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a4d2e] mb-6 text-balance">
            Feita por quem entende o desafio de empreender sozinho
          </h2>
          <p className="text-lg text-[#4a6741] leading-relaxed">
            A Dokei nasceu para resolver um problema real: a falta de
            ferramentas simples e acessíveis para o Microempreendedor
            Individual organizar seu negócio. Sem planilhas complicadas, sem
            mensalidades, sem complicação.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="h-full bg-white border border-[#d4e5c7] shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-6 lg:p-8">
                  <div className="w-14 h-14 bg-[#7ba23f]/10 border border-[#7ba23f]/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-[#7ba23f]" />
                  </div>

                  <h3 className="text-xl font-bold text-[#1a4d2e] mb-3 group-hover:text-[#7ba23f] transition-colors">
                    {value.title}
                  </h3>

                  <p className="text-[#4a6741] leading-relaxed">
                    {value.description}
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
