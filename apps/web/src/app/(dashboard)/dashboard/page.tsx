import { getAuthUser } from "@/lib/auth"
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
    href: "/calculadora",
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
  const user = await getAuthUser()
  if (!user) return null

  const primeiroNome =
    user?.nome?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "MEI"

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Olá, {primeiroNome}!
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          O que você precisa fazer hoje?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="group relative p-6 bg-card rounded-xl border border-border opacity-60 cursor-not-allowed">
        <div className="w-11 h-11 bg-muted rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-muted-foreground" />
        </div>
        <h2 className="text-base font-semibold text-card-foreground mt-4">
          {titulo}
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          {descricao}
        </p>
        <span className="inline-block mt-4 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Em breve
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="
        group relative p-6 bg-card rounded-xl border border-border
        shadow-sm hover:shadow-md
        hover:border-primary/30 hover:-translate-y-0.5
        transition-all duration-200
      "
    >
      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <Icon size={20} className="text-primary" />
      </div>
      <h2 className="text-base font-semibold text-card-foreground mt-4">
        {titulo}
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
        {descricao}
      </p>
    </Link>
  )
}
