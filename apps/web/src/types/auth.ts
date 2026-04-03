// Tipos usados nos formulários de autenticação
// Separar tipos em arquivo próprio facilita reuso e manutenção

export interface LoginFormData {
  email: string
  password: string
}

export interface CadastroFormData {
  email: string
  password: string
}

// Retorno padrão das Server Actions
// Evita retornos inconsistentes entre actions
export interface ActionResult {
  error?: string
  message?: string
}
