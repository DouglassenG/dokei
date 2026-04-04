"use server"

import { createClient } from "@/lib/supabase/server"
import { loginSchema, cadastroSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export async function login(formData: FormData): Promise<void> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  // Valida dados antes de qualquer operação no banco
  const parsed = loginSchema.safeParse(rawData)

  if (!parsed.success) {
    return redirect(`/login?error=${parsed.error.errors[0].message}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  // Mensagem genérica — não revela se o e-mail existe ou não
  if (error) {
    return redirect("/login?error=E-mail ou senha inválidos")
  }

  return redirect("/dashboard")
}

export async function cadastro(formData: FormData): Promise<void> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = cadastroSchema.safeParse(rawData)

  if (!parsed.success) {
    return redirect(`/cadastro?error=${parsed.error.errors[0].message}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return redirect("/cadastro?error=Erro ao criar conta. Tente novamente.")
  }

  return redirect("/cadastro?message=Confirme seu e-mail para continuar")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
