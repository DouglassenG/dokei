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
        <h2 className="text-xl font-semibold text-gray-900">Criar conta</h2>
        <p className="text-sm text-gray-500 mt-1">
          Comece grátis — sem cartão de crédito
        </p>
      </div>

      {/* Exibe erro vindo da URL — ex: e-mail já cadastrado */}
      {searchParams.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{searchParams.error}</p>
        </div>
      )}

      {/* Exibe mensagem de sucesso — ex: confirme seu e-mail */}
      {searchParams.message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{searchParams.message}</p>
        </div>
      )}

      {/* action={cadastro} envia o formulário para a Server Action */}
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

      <p className="text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
