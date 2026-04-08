import { z } from "zod"

// Zod valida os dados ANTES de chegar no banco
// Evita SQL injection e dados malformados

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export const cadastroSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100, "Nome muito longo"),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(72, "Senha muito longa"),
})

// Tipos inferidos do schema — sem duplicar código
export type LoginSchema = z.infer<typeof loginSchema>
export type CadastroSchema = z.infer<typeof cadastroSchema>
