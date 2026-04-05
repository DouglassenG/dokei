interface ButtonProps {
  label: string
  type?: "submit" | "button"
  variant?: "primary" | "secondary"
  icon?: React.ReactNode
}

export function Button({
  label,
  type = "button",
  variant = "primary",
  icon,
}: ButtonProps) {
  const styles = {
    primary: "bg-[#1B5E20] text-white hover:bg-[#145214] shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  }

  return (
    <button
      type={type}
      className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${styles[variant]}`}
    >
      {icon}
      {label}
    </button>
  )
}
