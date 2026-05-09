"use client"

// Componente reutilizável de input
// Props tipadas garantem uso correto em qualquer formulário

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputProps {
  id: string
  name: string
  type: "text" | "email" | "password"
  label: string
  placeholder?: string
  maxLength?: number
  required?: boolean
}

export function Input({
  id,
  name,
  type,
  label,
  placeholder,
  maxLength,
  required = false,
}: InputProps) {
  // Controla visibilidade da senha — só usado quando type="password"
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // Se for password, alterna entre "password" e "text"
  const inputType = type === "password" && mostrarSenha ? "text" : type

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-[#1B5E20]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors pr-10"
        />
        {/* Olhinho aparece apenas em campos de senha */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setMostrarSenha((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B5E20] transition-colors"
          >
            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}
