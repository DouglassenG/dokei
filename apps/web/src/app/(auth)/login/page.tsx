// Página de login — só renderiza o formulário
// Lógica de autenticação fica em actions.ts

import Link from "next/link"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { login } from "../actions"

// Props tipadas para receber parâmetros da URL
// Ex: /login?error=Credenciais inválidas
interface LoginPageProps {
  searchParams: {
    error?: string
    message?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Entrar</h2>
        <p className="text-sm text-white/80 mt-1">Acesse sua conta dokei</p>
      </div>

      {searchParams.error && (
        <div className="p-3 bg-red-500/20 border border-red-300/50 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{searchParams.error}</p>
        </div>
      )}

      {searchParams.message && (
        <div className="p-3 bg-white/20 border border-white/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{searchParams.message}</p>
        </div>
      )}

      <form action={login} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          required
        />
        <Button type="submit" label="Entrar" variant="primary" />
      </form>

      <p className="text-center text-sm text-white/80">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-white font-medium hover:underline"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  )
}
