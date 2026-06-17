import {
  FileText,
  TrendingUp,
  Bell,
  Calculator,
  GitGraphIcon,
} from "lucide-react"
import Link from "next/link"

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  href: string
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Emitir Recibo",
    description:
      "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp.",
    href: "/recibos",
  },
  {
    icon: TrendingUp,
    title: "Controle Financeiro",
    description: "Registre entradas e saídas separando negócio do pessoal.",
    href: "/financeiro",
  },
  {
    icon: Bell,
    title: "Lembretes DAS",
    description: "Nunca perca o prazo do seu DAS e obrigações fiscais.",
    href: "/obrigacoes",
  },
  {
    icon: Calculator,
    title: "Calculadora de Preço",
    description: "Descubra quanto cobrar pelo seu serviço em 30 segundos.",
    href: "/calculadora",
  },
  {
    icon: GitGraphIcon,
    title: "Gráficos de Desempenho",
    description:
      "Visualize seu crescimento com gráficos claros e fáceis de entender.",
    href: "/rendimentos",
  },
]

export function LandingFeatures() {
  return (
    <section className="px-6 py-20 sm:py-24 bg-[#1B5E20]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#8BC34A] text-sm font-semibold tracking-widest uppercase">
            Nossos Serviços
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Tudo o que seu MEI precisa
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Ferramentas pensadas para simplificar a gestão do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLastOdd =
              features.length % 2 !== 0 && index === features.length - 1
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={`block p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
                  isLastOdd
                    ? "sm:col-start-1 sm:col-end-3 sm:max-w-sm sm:mx-auto lg:col-auto lg:max-w-none"
                    : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#8BC34A]/20 border border-[#8BC34A]/30 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#8BC34A]" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
