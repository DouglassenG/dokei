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
        <h2 className="text-xl font-semibold text-gray-900">Entrar</h2>
        <p className="text-sm text-gray-500 mt-1">Acesse sua conta dokei</p>
      </div>

      {/* Exibe erro vindo da URL — ex: senha errada */}
      {searchParams.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{searchParams.error}</p>
        </div>
      )}

      {/* Exibe mensagem de sucesso — ex: e-mail confirmado */}
      {searchParams.message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{searchParams.message}</p>
        </div>
      )}

      {/* action={login} envia o formulário para a Server Action */}
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

      <p className="text-center text-sm text-gray-500">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-blue-600 hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  )
}
