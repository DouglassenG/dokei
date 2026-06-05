"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const plans = [
  {
    name: "Essencial",
    price: "Freemium",
    period: "/mês",
    description: "Para MEIs que querem organização completa",
    icon: Star,
    features: [
      "Recibos ilimitados",
      "Controle financeiro avançado",
      "Lembretes DAS + IRPF",
      "Calculadora de preço premium",
      "Relatório de rendimentos",
      "Suporte prioritário",
      "Exportar relatórios em PDF",
    ],
    cta: "Começar grátis",
    href: "/cadastro",
    popular: true,
    highlighted: true,
  },
]

export function LandingPlans() {
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
    <section id="planos" ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Planos e Preços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a4d2e] mb-6 text-balance">
            Freemium
          </h2>
          <p className="text-lg text-[#4a6741] leading-relaxed">
            O Dokei é 100% gratuito com todas as funcionalidades disponíveis.
            Comece agora mesmo sem pagar nada e experimente a diferença que uma
            gestão financeira eficiente pode fazer no seu MEI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card
                className={`relative h-full border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-[#7ba23f] shadow-lg scale-105 lg:scale-110"
                    : "border-[#d4e5c7] hover:border-[#7ba23f]/50"
                }`}
              >
                <CardHeader className="pb-4 pt-8">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.highlighted ? "bg-[#7ba23f]" : "bg-[#1a4d2e]/10"
                    }`}
                  >
                    <plan.icon
                      className={`w-6 h-6 ${
                        plan.highlighted ? "text-white" : "text-[#1a4d2e]"
                      }`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-[#1a4d2e]">
                    {plan.name}
                  </h3>
                  <p className="text-[#4a6741] text-sm mt-1">
                    {plan.description}
                  </p>

                  <div className="mt-4">
                    <span className="text-4xl lg:text-5xl font-bold text-[#1a4d2e]">
                      {plan.price}
                    </span>
                    <span className="text-[#4a6741]">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.highlighted
                              ? "text-[#7ba23f]"
                              : "text-[#1a4d2e]"
                          }`}
                        />
                        <span className="text-[#4a6741]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-300 flex items-center justify-center ${
                      plan.highlighted
                        ? "bg-[#7ba23f] hover:bg-[#6b9b37] text-white"
                        : "bg-[#1a4d2e] hover:bg-[#15422a] text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <p className="text-center text-[#4a6741] text-sm mt-10">
          Todos os planos incluem 7 dias de teste grátis. Cancele quando quiser.
        </p>
      </div>
    </section>
  )
}
