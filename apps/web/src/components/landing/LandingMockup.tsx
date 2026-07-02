"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, TrendingUp, Bell } from "lucide-react"

const screens = [
  {
    id: "recibos",
    label: "Emitir Recibo",
    icon: FileText,
    color: "#7ba23f",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-[#1a4d2e] px-3 py-2.5 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/20" />
          <span className="text-white text-[10px] font-bold tracking-wide">
            Dokei
          </span>
        </div>
        <div className="flex-1 p-3 space-y-2">
          <p className="text-[#1a4d2e] text-[9px] font-bold">Novo Recibo</p>
          <div className="space-y-1.5">
            <div className="h-5 rounded bg-[#f4f7f0] border border-[#d4e5c7] flex items-center px-2">
              <span className="text-[7px] text-[#4a6741]">Nome do cliente</span>
            </div>
            <div className="h-5 rounded bg-[#f4f7f0] border border-[#d4e5c7] flex items-center px-2">
              <span className="text-[7px] text-[#4a6741]">
                Descrição do serviço
              </span>
            </div>
            <div className="h-5 rounded bg-[#f4f7f0] border border-[#d4e5c7] flex items-center px-2">
              <span className="text-[7px] text-[#4a6741]">R$ 0,00</span>
            </div>
          </div>
          <div className="h-6 rounded-lg bg-[#7ba23f] flex items-center justify-center mt-3">
            <span className="text-white text-[8px] font-semibold">
              Gerar PDF
            </span>
          </div>
          <div className="mt-2 border border-[#d4e5c7] rounded p-2 bg-[#f4f7f0]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] font-bold text-[#1a4d2e]">
                RECIBO
              </span>
              <span className="text-[6px] text-[#4a6741]">#001</span>
            </div>
            <div className="h-px bg-[#d4e5c7] mb-1" />
            <div className="space-y-0.5">
              <div className="h-1.5 bg-[#d4e5c7] rounded w-3/4" />
              <div className="h-1.5 bg-[#d4e5c7] rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: TrendingUp,
    color: "#1a4d2e",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-[#1a4d2e] px-3 py-2.5 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/20" />
          <span className="text-white text-[10px] font-bold tracking-wide">
            Dokei
          </span>
        </div>
        <div className="flex-1 p-3 space-y-2">
          <p className="text-[#1a4d2e] text-[9px] font-bold">
            Controle Financeiro
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-[#f4f7f0] border border-[#d4e5c7] rounded p-1.5">
              <p className="text-[6px] text-[#4a6741]">Negócio</p>
              <p className="text-[9px] font-bold text-[#1a4d2e]">R$ 2.450</p>
            </div>
            <div className="bg-[#f4f7f0] border border-[#d4e5c7] rounded p-1.5">
              <p className="text-[6px] text-[#4a6741]">Pessoal</p>
              <p className="text-[9px] font-bold text-[#1a4d2e]">R$ 890</p>
            </div>
          </div>
          <div className="space-y-1">
            {[
              { desc: "Serviço gráfico", val: "+R$ 350", cor: "#7ba23f" },
              { desc: "Aluguel equipamento", val: "-R$ 120", cor: "#ef4444" },
              { desc: "Consultoria", val: "+R$ 600", cor: "#7ba23f" },
            ].map((item) => (
              <div
                key={item.desc}
                className="flex justify-between items-center py-1 border-b border-[#f4f7f0]"
              >
                <span className="text-[7px] text-[#1a4d2e]">{item.desc}</span>
                <span
                  className="text-[7px] font-semibold"
                  style={{ color: item.cor }}
                >
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "obrigacoes",
    label: "Lembretes DAS",
    icon: Bell,
    color: "#4a6741",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-[#1a4d2e] px-3 py-2.5 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/20" />
          <span className="text-white text-[10px] font-bold tracking-wide">
            Dokei
          </span>
        </div>
        <div className="flex-1 p-3 space-y-2">
          <p className="text-[#1a4d2e] text-[9px] font-bold">
            Obrigações Fiscais
          </p>
          <div className="border border-[#d4e5c7] rounded-lg p-2 bg-[#f4f7f0]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] font-bold text-[#1a4d2e]">
                  DAS Mensal
                </p>
                <p className="text-[6px] text-[#4a6741]">Vence em 5 dias</p>
              </div>
              <div className="bg-amber-100 px-1.5 py-0.5 rounded">
                <span className="text-[6px] text-amber-700 font-semibold">
                  Pendente
                </span>
              </div>
            </div>
            <div className="mt-1.5 h-1 bg-[#d4e5c7] rounded-full">
              <div className="h-1 bg-[#7ba23f] rounded-full w-4/5" />
            </div>
          </div>
          <div className="border border-[#d4e5c7] rounded-lg p-2">
            <p className="text-[7px] font-semibold text-[#1a4d2e] mb-1">
              Faturamento 2024
            </p>
            <div className="flex justify-between text-[6px] text-[#4a6741] mb-1">
              <span>R$ 52.300 / R$ 81.900</span>
              <span>63%</span>
            </div>
            <div className="h-1.5 bg-[#f4f7f0] rounded-full border border-[#d4e5c7]">
              <div className="h-1.5 bg-[#7ba23f] rounded-full w-[63%]" />
            </div>
          </div>
          <div className="h-5 rounded-lg bg-[#1a4d2e] flex items-center justify-center">
            <span className="text-white text-[7px] font-semibold">
              Pagar DAS no Gov.br
            </span>
          </div>
        </div>
      </div>
    ),
  },
]

export function LandingMockup() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeScreen, setActiveScreen] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % screens.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible])

  const active = screens[activeScreen]

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#f4f7f0] overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Na palma da mão
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a4d2e] mb-6 text-balance drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]">
            Gerencie seu MEI de qualquer lugar
          </h2>
          <p className="text-lg text-[#4a6741] leading-relaxed">
            A Dokei foi pensada para funcionar perfeitamente no celular. Emita
            recibos, controle finanças e acompanhe obrigações fiscais — tudo
            direto do seu smartphone.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#1a4d2e]/20 rounded-full blur-xl" />
            <div
              className="relative w-[200px] sm:w-[220px]"
              style={{ filter: "drop-shadow(0 32px 48px rgba(26,77,46,0.25))" }}
            >
              <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-2.5 ring-1 ring-white/10">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1a1a] rounded-full z-20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a]" />
                  <div className="w-4 h-1.5 rounded-full bg-[#2a2a2a]" />
                </div>
                <div
                  className="relative bg-white rounded-[2rem] overflow-hidden"
                  style={{ height: "380px" }}
                >
                  <div className="bg-[#1a4d2e] h-6 flex items-center justify-between px-4">
                    <span className="text-white text-[7px] font-medium">
                      9:41
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-1.5 border border-white/60 rounded-sm">
                        <div className="w-2 h-full bg-white/60 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="h-full transition-all duration-500">
                    {active?.preview}
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-16 h-1 bg-white/20 rounded-full" />
                </div>
              </div>
              <div className="absolute top-16 -left-1 w-1 h-8 bg-[#2a2a2a] rounded-l" />
              <div className="absolute top-28 -left-1 w-1 h-6 bg-[#2a2a2a] rounded-l" />
              <div className="absolute top-20 -right-1 w-1 h-10 bg-[#2a2a2a] rounded-r" />
            </div>
          </div>

          <div
            className={`max-w-sm w-full transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-3">
              {screens.map((screen, index) => {
                const Icon = screen.icon
                const isActive = index === activeScreen
                return (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(index)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "bg-white border-[#d4e5c7] shadow-md"
                        : "bg-transparent border-transparent hover:bg-white/60"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: isActive
                          ? `${screen.color}20`
                          : "transparent",
                        border: isActive
                          ? `1px solid ${screen.color}40`
                          : "1px solid transparent",
                      }}
                    >
                      <Icon
                        size={18}
                        style={{ color: isActive ? screen.color : "#4a6741" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-[#1a4d2e]" : "text-[#4a6741]"
                        }`}
                      >
                        {screen.label}
                      </p>
                      <p className="text-xs text-[#4a6741]/70 mt-0.5">
                        {index === 0 && "PDF profissional em segundos"}
                        {index === 1 && "Negócio e pessoal separados"}
                        {index === 2 && "Nunca pague multa por atraso"}
                      </p>
                    </div>
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: screen.color }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2 mt-6 px-1">
              {screens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveScreen(index)}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    flex: index === activeScreen ? 3 : 1,
                    background: index === activeScreen ? "#7ba23f" : "#d4e5c7",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
