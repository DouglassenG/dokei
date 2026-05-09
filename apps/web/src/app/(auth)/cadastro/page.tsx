import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { cadastro, loginGoogle } from "../actions"

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
        <h2 className="text-xl font-semibold text-[#1B5E20]">Criar conta</h2>
        <p className="text-sm text-[#2E7D32] mt-1">
          Comece grátis — sem cartão de crédito
        </p>
      </div>

      {params.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{params.error}</p>
        </div>
      )}

      {params.message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-[#1B5E20]">{params.message}</p>
        </div>
      )}

      <form action={loginGoogle}>
        <button
          type="submit"
          className="cursor-pointer w-full py-3 px-4 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Cadastrar com Google
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-gray-400">ou use seu e-mail</span>
        </div>
      </div>

      <form className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Nome"
          placeholder="Seu nome"
          required
        />
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
        <Input
          id="cnpj"
          name="cnpj"
          type="text"
          label="CNPJ"
          placeholder="00.000.000/0001-00"
          maxLength={18}
          required
        />
        <p className="text-xs text-gray-400 -mt-2">
          Usado para garantir um período de teste por empresa.
        </p>
        <Button
          type="submit"
          formAction={cadastro}
          label="Começar grátis"
          variant="primary"
          icon={<UserPlus size={18} />}
        />
      </form>

      <p className="text-center text-sm text-[#2E7D32]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-[#1B5E20] font-medium hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
