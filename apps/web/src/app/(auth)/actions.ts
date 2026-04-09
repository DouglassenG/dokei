"use server"

import { createClient } from "@/lib/supabase/server"
import {
  loginSchema,
  cadastroSchema,
  esqueceuSenhaSchema,
  redefinirSenhaSchema,
} from "@/lib/validations/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function login(formData: FormData): Promise<void> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(rawData)

  if (!parsed.success) {
    const mensagem = parsed.error.issues[0]?.message ?? "Dados inválidos"
    return redirect(`/login?error=${mensagem}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return redirect("/login?error=E-mail ou senha inválidos")
  }

  return redirect("/dashboard")
}

export async function cadastro(formData: FormData): Promise<void> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = cadastroSchema.safeParse(rawData)

  if (!parsed.success) {
    const mensagem = parsed.error.issues[0]?.message ?? "Dados inválidos"
    return redirect(`/cadastro?error=${mensagem}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.name } },
  })

  if (error) {
    if (
      error.message.includes("rate limit") ||
      error.message.includes("email")
    ) {
      return redirect(
        "/cadastro?error=Limite de cadastros atingido. Tente novamente em alguns minutos.",
      )
    }
    return redirect("/cadastro?error=Erro ao criar conta. Tente novamente.")
  }

  return redirect(
    "/cadastro?message=Conta criada! Verifique seu e-mail para confirmar o acesso.",
  )
}

export async function loginGoogle(): Promise<void> {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get("origin") ?? "http://localhost:3000"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data.url) {
    return redirect("/login?error=Erro ao conectar com Google")
  }

  return redirect(data.url)
}

export async function esqueceuSenha(formData: FormData): Promise<void> {
  const rawData = {
    email: formData.get("email"),
  }

  const parsed = esqueceuSenhaSchema.safeParse(rawData)

  if (!parsed.success) {
    const mensagem = parsed.error.issues[0]?.message ?? "Dados inválidos"
    return redirect(`/esqueci-senha?error=${mensagem}`)
  }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get("origin") ?? "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${origin}/auth/confirm?type=recovery`,
    },
  )

  if (error) {
    return redirect(
      "/esqueci-senha?error=Erro ao enviar e-mail. Tente novamente.",
    )
  }

  return redirect(
    "/esqueci-senha?message=Verifique seu e-mail para redefinir a senha",
  )
}

export async function redefinirSenha(formData: FormData): Promise<void> {
  const rawData = {
    password: formData.get("password"),
  }

  const parsed = redefinirSenhaSchema.safeParse(rawData)

  if (!parsed.success) {
    const mensagem = parsed.error.issues[0]?.message ?? "Dados inválidos"
    return redirect(`/redefinir-senha?error=${mensagem}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return redirect(
      "/redefinir-senha?error=Erro ao redefinir senha. Tente novamente.",
    )
  }

  return redirect("/login?message=Senha redefinida com sucesso")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
