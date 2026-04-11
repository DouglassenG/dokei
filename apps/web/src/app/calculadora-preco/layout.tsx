import type { Metadata } from "next"

/**
 * Layout da Calculadora de Precificação
 *
 * Define os metadados de SEO e OpenGraph da página.
 * Sem esse layout, o Google e o WhatsApp usariam
 * o título genérico do projeto em vez do título específico da calculadora.
 */
export const metadata: Metadata = {
  // Título exibido na aba do navegador e nos resultados do Google
  title: "Calculadora de Preço para MEI — dokei",

  // Descrição exibida nos resultados do Google
  description:
    "Descubra quanto cobrar pelo seu serviço em 30 segundos. Grátis. Feito para MEI.",

  // OpenGraph — controla o preview quando o link é compartilhado
  // no WhatsApp, Instagram, LinkedIn e outras redes sociais
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
  // Sem wrapper extra — apenas passa os filhos direto
  // O layout raiz (src/app/layout.tsx) já cuida do <html> e <body>
  return <>{children}</>
}
