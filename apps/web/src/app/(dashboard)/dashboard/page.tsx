// Página inicial do dashboard
// Mostra boas vindas e atalhos para as 4 funcionalidades do MVP

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  FileText, // ícone de Emitir Recibo
  TrendingUp, // ícone de Controle Financeiro
  Bell, // ícone de Lembretes DAS
  Calculator, // ícone de Calculadora de Preço
} from "lucide-react"

// Tipagem do card de funcionalidade
// Substituído 'emoji' por 'icon' para usar lucide-react
interface FuncionalidadeCard {
  titulo: string
  descricao: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  disponivel: boolean
}

// Lista das 4 funcionalidades do MVP
// disponivel: false → mostra como "em breve" sem link
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
]

export default async function DashboardPage() {
  // Busca dados do usuário logado para personalizar a tela
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pega o primeiro nome do usuário — do Google ou do e-mail
  const primeiroNome =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "MEI"

  return (
    <div className="space-y-8">
      {/* Boas vindas */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {primeiroNome}!
        </h1>
        <p className="text-gray-500 mt-1">O que você precisa fazer hoje?</p>
      </div>

      {/* Grid de funcionalidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {funcionalidades.map((item) => (
          <Card key={item.href} {...item} />
        ))}
      </div>
    </div>
  )
}

// Componente do card — separado para manter o código limpo
function Card({
  titulo,
  descricao,
  href,
  icon: Icon,
  disponivel,
}: FuncionalidadeCard) {
  // Card desabilitado — funcionalidade ainda não disponível
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

  // Card habilitado — leva para a funcionalidade
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
