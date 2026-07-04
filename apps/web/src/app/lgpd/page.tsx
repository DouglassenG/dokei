import type { Metadata } from "next"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingLGPD } from "@/components/landing/LandingLGPD"
import { LandingFooter } from "@/components/landing/LandingFooter"

export const metadata: Metadata = {
  title: "LGPD | Dokei",
  description:
    "Saiba como a Dokei protege seus dados pessoais conforme a Lei Geral de Proteção de Dados.",
}

export default function LGPDPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <div className="pt-16 lg:pt-20">
        <LandingLGPD />
      </div>
      <LandingFooter />
    </main>
  )
}
