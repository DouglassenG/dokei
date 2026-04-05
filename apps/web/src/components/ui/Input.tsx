// Componente reutilizável de input
// Props tipadas garantem uso correto em qualquer formulário

interface InputProps {
  id: string
  name: string
  type: "text" | "email" | "password"
  label: string
  placeholder?: string
  required?: boolean
}

export function Input({
  id,
  name,
  type,
  label,
  placeholder,
  required = false,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-[#1B5E20]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors"
      />
    </div>
  )
}
