"use server"

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect("/login?error=Credenciais inválidas")
  }

  redirect("/dashboard")
}

export async function cadastro(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect("/cadastro?error=Erro ao criar conta")
  }

  redirect("/cadastro?message=Confirme seu e-mail para continuar")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
