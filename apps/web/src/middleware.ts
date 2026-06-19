import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

/**
 * Rotas protegidas — exigem login via Clerk.
 * Qualquer rota que comece com esses prefixos será bloqueada para visitantes.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/recibos(.*)",
  "/financeiro(.*)",
  "/obrigacoes(.*)",
  "/calculadora-preco(.*)",
  "/rendimentos(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Ignora arquivos estáticos do Next.js e assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Sempre roda para API routes
    "/(api|trpc)(.*)",
  ],
}
