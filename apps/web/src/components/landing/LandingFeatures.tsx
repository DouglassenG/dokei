import { FileText, TrendingUp, Bell, Calculator } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Emitir Recibo",
    description: "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp.",
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
]

export function LandingFeatures() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg"
            >
              <div className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#1B5E20] mb-1">{feature.title}</h3>
              <p className="text-sm text-[#2E7D32]">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
