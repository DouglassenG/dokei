import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ptBR } from "@clerk/localizations"
import "./globals.css"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

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
    <ClerkProvider
      localization={ptBR}
      appearance={{
        variables: {
          colorPrimary: "#1B5E20",
          colorText: "#1a1a1a",
          colorTextSecondary: "#666666",
          colorBackground: "#ffffff",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html
        lang="pt-BR"
        className="scroll-smooth bg-background"
        suppressHydrationWarning
      >
        <body className={`${montserrat.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ChatWidget />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
