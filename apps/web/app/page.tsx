import Link from "next/link"
import { FileText, TrendingUp, Bell, Calculator } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
}

const features: Feature[] = [
  { icon: FileText, title: "Emitir Recibo", description: "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp." },
  { icon: TrendingUp, title: "Controle Financeiro", description: "Registre entradas e saídas separando negócio do pessoal." },
  { icon: Bell, title: "Lembretes DAS", description: "Nunca perca o prazo do seu DAS e obrigações fiscais." },
  { icon: Calculator, title: "Calculadora de Preço", description: "Descubra quanto cobrar pelo seu serviço em 30 segundos." },
]

export default function Home() {
  return (
    <div>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">dokei</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-white px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">dokei</h1>
          <p className="mt-4 text-lg text-gray-500">Gestão simples para MEI</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/cadastro"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
            >
              Começar grátis
            </Link>
            <Link
              href="/login"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 px-6 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="p-6 bg-white rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-gray-900">dokei</p>
        <p className="text-sm text-gray-500 mt-1">Gestão simples para MEI</p>
      </footer>
    </div>
  )
}
