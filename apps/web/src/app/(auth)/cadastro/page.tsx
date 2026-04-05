import Link from "next/link"

interface CadastroPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function CadastroPage({
  searchParams,
}: CadastroPageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Criar conta</h2>
        <p className="text-sm text-white/80 mt-1">
          Comece grátis — sem cartão de crédito
        </p>
      </div>

      {params.error && (
        <div className="p-3 bg-red-500/20 border border-red-300/50 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{params.error}</p>
        </div>
      )}

      {params.message && (
        <div className="p-3 bg-white/20 border border-white/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{params.message}</p>
        </div>
      )}

      <form className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="mínimo 6 caracteres"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-[#1B5E20] font-medium py-3 px-4 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
        >
          Criar conta grátis
        </button>
      </form>

      <p className="text-center text-sm text-white/80">
        Já tem conta?{" "}
        <Link href="/login" className="text-white font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
