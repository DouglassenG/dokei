import type { Metadata } from "next"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingAbout } from "@/components/landing/LandingAbout"
import { LandingFooter } from "@/components/landing/LandingFooter"

export const metadata: Metadata = {
  title: "Quem Somos | Dokei",
  description:
    "Conheça a missão da Dokei e por que a plataforma é 100% gratuita para o MEI.",
}

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <div className="pt-16 lg:pt-20">
        <LandingAbout />
      </div>
      <LandingFooter />
    </main>
  )
}
