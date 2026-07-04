import Link from "next/link"
import { ChevronRight } from "lucide-react"

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
      <div
        aria-disabled="true"
        className="
          group relative flex items-center gap-4 p-4
          sm:flex-col sm:items-start sm:gap-0 sm:p-6
          bg-card rounded-2xl sm:rounded-xl border border-border
          opacity-60 cursor-not-allowed
        "
      >
        <div className="w-12 h-12 sm:w-11 sm:h-11 shrink-0 bg-muted rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1 sm:flex-none sm:mt-4">
          <h2 className="text-base font-semibold text-card-foreground truncate sm:whitespace-normal">
            {titulo}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 sm:mt-1.5 leading-relaxed line-clamp-1 sm:line-clamp-none">
            {descricao}
          </p>
        </div>

        <span className="hidden sm:inline-block mt-4 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Em breve
        </span>
        <span className="sm:hidden shrink-0 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
          Em breve
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="
        group relative flex items-center gap-4 p-4
        sm:flex-col sm:items-start sm:gap-0 sm:p-6
        bg-card rounded-2xl sm:rounded-xl border border-border
        shadow-sm hover:shadow-md
        hover:border-primary/30 sm:hover:-translate-y-0.5
        active:scale-[0.98] sm:active:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        transition-all duration-200
      "
    >
      <div className="w-12 h-12 sm:w-11 sm:h-11 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <Icon size={20} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1 sm:flex-none sm:mt-4">
        <h2 className="text-base font-semibold text-card-foreground truncate sm:whitespace-normal">
          {titulo}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5 sm:mt-1.5 leading-relaxed line-clamp-1 sm:line-clamp-none">
          {descricao}
        </p>
      </div>

      <ChevronRight
        size={20}
        className="sm:hidden shrink-0 text-muted-foreground group-hover:text-primary group-active:translate-x-0.5 transition-all"
      />
    </Link>
  )
}
