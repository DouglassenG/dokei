// Página inicial do dashboard
// Mostra boas vindas e atalhos para as funcionalidades do MVP

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { FileText, TrendingUp, Bell, Calculator, BarChart2 } from "lucide-react"

interface FuncionalidadeCard {
  titulo: string
  descricao: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  disponivel: boolean
}

const funcionalidades: FuncionalidadeCard[] = [
  {
    titulo: "Emitir Recibo",
    descricao: "Gere recibos profissionais em PDF e compartilhe pelo WhatsApp.",
    href: "/recibos/novo",
    icon: FileText,
    disponivel: true,
  },
  {
    titulo: "Controle Financeiro",
    descricao: "Registre entradas e saídas separando negócio do pessoal.",
    href: "/financeiro",
    icon: TrendingUp,
    disponivel: true,
  },
  {
    titulo: "Lembretes DAS",
    descricao: "Nunca perca o prazo do seu DAS e obrigações fiscais.",
    href: "/obrigacoes",
    icon: Bell,
    disponivel: true,
  },
  {
    titulo: "Calculadora de Preço",
    descricao: "Descubra quanto cobrar pelo seu serviço em 30 segundos.",
    href: "/calculadora-preco",
    icon: Calculator,
    disponivel: true,
  },
  {
    titulo: "Declaração de Rendimentos",
    descricao: "Veja quanto movimentou no ano e declare seu faturamento MEI.",
    href: "/rendimentos",
    icon: BarChart2,
    disponivel: true,
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const primeiroNome =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "MEI"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {primeiroNome}!
        </h1>
        <p className="text-gray-500 mt-1">O que você precisa fazer hoje?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {funcionalidades.map((item) => (
          <Card key={item.href} {...item} />
        ))}
      </div>
    </div>
  )
}

function Card({
  titulo,
  descricao,
  href,
  icon: Icon,
  disponivel,
}: FuncionalidadeCard) {
  if (!disponivel) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-100 opacity-60 cursor-not-allowed">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-gray-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mt-3">{titulo}</h2>
        <p className="text-sm text-gray-500 mt-1">{descricao}</p>
        <span className="inline-block mt-3 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Em breve
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#1B5E20]/20 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-[#1B5E20]" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 mt-3">{titulo}</h2>
      <p className="text-sm text-gray-500 mt-1">{descricao}</p>
    </Link>
  )
}
