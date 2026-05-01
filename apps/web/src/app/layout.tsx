import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ChatWidget } from "@/components/chat/ChatWidget"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Dokei - Gestão Simples para MEI",
  description:
    "Simplifique sua gestão como MEI. Emita recibos, controle finanças, lembre do DAS e muito mais. Comece grátis!",
  keywords: [
    "MEI",
    "gestão",
    "microempreendedor",
    "recibo",
    "DAS",
    "controle financeiro",
  ],
  icons: {
    icon: "/logotipo_site_2.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth bg-background">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
