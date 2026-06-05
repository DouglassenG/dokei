import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8BC34A] px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="h-1 bg-[#1B5E20]" />
        <div className="p-8">
          {/* Botão voltar ao site */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              <ArrowLeft size={15} />
              Voltar ao site
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1B5E20]">Dokei</h1>
            <p className="text-sm text-[#2E7D32] mt-1">
              Gestão simples para MEI
            </p>
            <ClerkProvider>
              <ClerkProvider>
                <header className="flex justify-end items-center p-4 gap-4 h-16">
                  <Show when="signed-out">
                    <SignInButton />
                    <SignUpButton>
                      <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </header>
                {children}
              </ClerkProvider>
            </ClerkProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
