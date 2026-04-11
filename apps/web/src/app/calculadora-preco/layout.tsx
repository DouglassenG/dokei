import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calculadora de Preço para MEI — dokei",
  description:
    "Descubra quanto cobrar pelo seu serviço em 30 segundos. Grátis. Feito para MEI.",
  openGraph: {
    title: "Calculadora de Preço para MEI — dokei",
    description: "Descubra quanto cobrar pelo seu serviço em 30 segundos.",
    url: "https://dokei.com.br/calculadora-preco",
    siteName: "dokei",
    locale: "pt_BR",
    type: "website",
  },
}

export default function CalculadoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
