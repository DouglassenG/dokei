"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#1a4d2e]/95 backdrop-blur-md shadow-lg"
          : "bg-[#1a4d2e]"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center">
            <Image
              src="/vetor_site.svg"
              alt="Dokei"
              width={232}
              height={40}
              className="h-12 w-auto lg:h-20 object-contain rounded-md"
              priority
            />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#servicos"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              Serviços
            </a>
            <a
              href="#planos"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-sm font-medium text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center bg-white text-[#1a4d2e] hover:bg-white/90 font-semibold px-6 h-9 rounded-md text-sm transition-colors"
            >
              Começar grátis
            </Link>
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav className="px-4 py-4 space-y-4 bg-[#1a4d2e] border-t border-white/10">
          <a
            href="#servicos"
            className="block text-white/90 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Serviços
          </a>
          <a
            href="#planos"
            className="block text-white/90 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Planos
          </a>
          <a
            href="#faq"
            className="block text-white/90 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FAQ
          </a>
          <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center bg-white text-[#1a4d2e] hover:bg-white/90 font-semibold px-4 py-2 rounded-md text-sm transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
