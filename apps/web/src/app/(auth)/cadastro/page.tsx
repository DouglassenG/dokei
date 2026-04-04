// Página de cadastro — só renderiza o formulário
// Lógica de criação de conta fica em actions.ts

import Link from "next/link"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { cadastro } from "../actions"

// Props tipadas para receber parâmetros da URL
// Ex: /cadastro?message=Confirme seu e-mail
interface CadastroPageProps {
  searchParams: {
    error?: string
    message?: string
  }
}

export default function CadastroPage({ searchParams }: CadastroPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Criar conta</h2>
        <p className="text-sm text-white/80 mt-1">
          Comece grátis — sem cartão de crédito
        </p>
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

      <form action={cadastro} className="space-y-4">
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
          placeholder="mínimo 6 caracteres"
          required
        />
        <Button type="submit" label="Criar conta grátis" variant="primary" />
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
