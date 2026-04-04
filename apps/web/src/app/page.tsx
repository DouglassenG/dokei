import Link from "next/link"
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
]
export default function Home() {
  return (
    <div className="min-h-screen bg-[#8BC34A]">
      <header className="sticky top-0 z-10 bg-[#1B5E20]/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-white">Dokei</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm text-[#1B5E20] bg-white hover:bg-white/90 px-4 py-2 rounded-lg font-medium"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main>
        <section className="px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-sm">
            Dokei
          </h1>
          <p className="mt-4 text-lg text-white/90">Gestão simples para MEI</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/cadastro"
              className="bg-[#1B5E20] text-white hover:bg-[#145214] px-6 py-3 rounded-lg font-medium shadow-lg"
            >
              Começar grátis
            </Link>
            <Link
              href="/login"
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium border border-white/30"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

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
                  <h3 className="font-semibold text-[#1B5E20] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#2E7D32]">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="bg-[#1B5E20] px-6 py-8 text-center">
        <p className="text-sm font-semibold text-white">dokei</p>
        <p className="text-sm text-white/80 mt-1">Gestão simples para MEI</p>
      </footer>
    </div>
  )
}
