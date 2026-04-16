import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingServices } from "@/components/landing/LandingServices"
import { LandingPlans } from "@/components/landing/LandingPlans"
import { LandingFAQ } from "@/components/landing/LandingFAQ"
import { LandingCTA } from "@/components/landing/LandingCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <LandingHero />
      <LandingServices />
      <LandingPlans />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
