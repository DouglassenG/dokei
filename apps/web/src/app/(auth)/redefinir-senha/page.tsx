import Link from "next/link"
import { Lock } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { redefinirSenha } from "../actions"

interface RedefinirSenhaPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function RedefinirSenhaPage({
  searchParams,
}: RedefinirSenhaPageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1B5E20]">Redefinir senha</h2>
        <p className="text-sm text-[#2E7D32] mt-1">
          Escolha uma nova senha para sua conta
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

      <form action={redefinirSenha} className="space-y-4">
        <Input
          id="password"
          name="password"
          type="password"
          label="Nova senha"
          placeholder="mínimo 6 caracteres"
          required
        />
        <Button
          type="submit"
          label="Redefinir senha"
          variant="primary"
          icon={<Lock size={18} />}
        />
      </form>

      <p className="text-center text-sm text-[#2E7D32]">
        <Link
          href="/login"
          className="text-[#1B5E20] font-medium hover:underline"
        >
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
