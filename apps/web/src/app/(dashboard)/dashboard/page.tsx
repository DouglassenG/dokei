import { getAuthUser } from "@/lib/auth"
import { FileText, TrendingUp, Bell, Calculator, BarChart2 } from "lucide-react"
import {
  FuncionalidadeCard,
  type FuncionalidadeCardProps,
} from "@/components/dashboard/FuncionalidadeCard"

const funcionalidades: FuncionalidadeCardProps[] = [
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
          <FuncionalidadeCard key={item.href} {...item} />
        ))}
      </div>
    </div>
  )
}
