import Link from "next/link"

export interface FuncionalidadeCardProps {
  titulo: string
  descricao: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  disponivel: boolean
}

export function FuncionalidadeCard({
  titulo,
  descricao,
  href,
  icon: Icon,
  disponivel,
}: FuncionalidadeCardProps) {
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
