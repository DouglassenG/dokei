// Componente de botão reutilizável
// variant permite estender para outros estilos futuramente

interface ButtonProps {
  label: string
  type?: "submit" | "button"
  variant?: "primary" | "secondary"
}

export function Button({
  label,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  }

  return (
    <button
      type={type}
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${styles[variant]}`}
    >
      {label}
    </button>
  )
}
