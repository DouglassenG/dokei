import Link from "next/link"
import { LogIn } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { login, loginGoogle } from "../actions"

// ALTERAÇÃO 1: searchParams agora é Promise — obrigatório no Next.js 16
interface LoginPageProps {
  searchParams: Promise<{
    error?: string
    message?: string
  }>
}

// ALTERAÇÃO 2: função virou async para poder usar await
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // ALTERAÇÃO 3: await "abre" a Promise e entrega o objeto com error e message
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1B5E20]">Entrar</h2>
        <p className="text-sm text-[#2E7D32] mt-1">Acesse sua conta Dokei</p>
      </div>

      {/* ALTERAÇÃO 4: trocado searchParams.error por params.error */}
      {params.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{params.error}</p>
        </div>
      )}

      {/* ALTERAÇÃO 4: trocado searchParams.message por params.message */}
      {params.message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-[#1B5E20]">{params.message}</p>
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
        <div className="flex justify-end">
          <Link
            href="/esqueci-senha"
            className="text-sm text-[#2E7D32] hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <Button
          type="submit"
          label="Entrar"
          variant="primary"
          icon={<LogIn size={18} />}
        />
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-gray-400">ou continue com</span>
        </div>
      </div>

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
          Entrar com Google
        </button>
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
