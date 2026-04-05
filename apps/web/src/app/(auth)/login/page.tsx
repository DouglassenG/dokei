// Página de login — só renderiza o formulário
// Lógica de autenticação fica em actions.ts

import Link from "next/link"
import { LogIn } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { login } from "../actions"

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
        <h2 className="text-xl font-semibold text-[#1B5E20]">Entrar</h2>
        <p className="text-sm text-[#2E7D32] mt-1">Acesse sua conta Dokei</p>
      </div>

      {searchParams.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{searchParams.error}</p>
        </div>
      )}

      {searchParams.message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-[#1B5E20]">{searchParams.message}</p>
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
        <Button
          type="submit"
          label="Entrar"
          variant="primary"
          icon={<LogIn size={18} />}
        />
      </form>

      <p className="text-center text-sm text-[#2E7D32]">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-[#1B5E20] font-medium hover:underline"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  )
}
