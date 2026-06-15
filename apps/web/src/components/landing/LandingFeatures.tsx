import {
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  GitGraphIcon,
} from "lucide-react"
import Image from "next/image"

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Emitir Recibo",
    description:
      "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp.",
  },
  {
    icon: TrendingUp,
    title: "Controle Financeiro",
    description: "Registre entradas e saídas separando negócio do pessoal.",
  },
  {
    icon: Bell,
    title: "Lembretes DAS",
    description: "Nunca perca o prazo do seu DAS e obrigações fiscais.",
  },
  {
    icon: Calculator,
    title: "Calculadora de Preço",
    description: "Descubra quanto cobrar pelo seu serviço em 30 segundos.",
  },
  {
    icon: GitGraphIcon,
    title: "Gráficos de Desempenho",
    description:
      "Visualize seu crescimento com gráficos claros e fáceis de entender.",
  },
]

export function LandingFeatures() {
  return (
    <section className="relative px-6 py-20 sm:py-24 overflow-hidden bg-[#1B5E20]">
      {/* Background image com overlay */}
      <div className="absolute inset-0">
        <Image
          src="/features_dokei.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20] via-[#1B5E20]/80 to-[#1B5E20]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#8BC34A] text-sm font-semibold tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            Nossos Serviços
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Tudo o que seu MEI precisa
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            Ferramentas pensadas para simplificar a gestão do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLastOdd =
              features.length % 2 !== 0 && index === features.length - 1
            return (
              <div
                key={feature.title}
                className={`p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
                  isLastOdd
                    ? "sm:col-start-1 sm:col-end-3 sm:max-w-sm sm:mx-auto lg:col-auto lg:max-w-none"
                    : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#8BC34A]/20 border border-[#8BC34A]/30 rounded-xl flex items-center justify-center mb-4">
                  <Icon
                    size={22}
                    className="text-[#8BC34A] drop-shadow-[0_0_6px_rgba(139,195,74,0.5)]"
                  />
                </div>
                <h3 className="font-semibold text-white mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
