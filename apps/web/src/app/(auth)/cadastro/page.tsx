import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"

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

      <form className="space-y-4">
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
        <Button
          type="submit"
          label="Começar grátis"
          variant="primary"
          icon={<UserPlus size={18} />}
        />
      </form>

      <p className="text-center text-sm text-[#2E7D32]">
        Já tem conta?{" "}
        <Link href="/login" className="text-[#1B5E20] font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
