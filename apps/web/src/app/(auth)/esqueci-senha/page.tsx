import Link from "next/link"
import { KeyRound } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { esqueceuSenha } from "../actions"

interface EsqueciSenhaPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function EsqueciSenhaPage({
  searchParams,
}: EsqueciSenhaPageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1B5E20]">Esqueci minha senha</h2>
        <p className="text-sm text-[#2E7D32] mt-1">
          Enviaremos um link para redefinir sua senha
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

      <form action={esqueceuSenha} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
        />
        <Button
          type="submit"
          label="Enviar link de recuperação"
          variant="primary"
          icon={<KeyRound size={18} />}
        />
      </form>

      <p className="text-center text-sm text-[#2E7D32]">
        Lembrou a senha?{" "}
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
