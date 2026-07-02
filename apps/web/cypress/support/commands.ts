/// <reference types="cypress" />

/**
 * cy.login() — autentica via API do Clerk, sem formulário e sem OTP.
 *
 * O Clerk exige dois cookies para validar a sessão no browser:
 *   __session     — JWT da sessão
 *   __client_uat  — Unix timestamp (em segundos) de quando a sessão foi criada
 *
 * Sem o __client_uat, o Clerk rejeita o __session com o erro:
 *   __clerk_hs_reason=session-token-but-no-client-uat
 *
 * Variáveis necessárias no cypress.env.json:
 *   CLERK_SECRET_KEY  — sk_test_...  (painel do Clerk → API Keys)
 *   CLERK_USER_ID     — user_...     (painel do Clerk → Users → seu usuário)
 */
Cypress.Commands.add("login", () => {
  const secretKey = Cypress.env("CLERK_SECRET_KEY") as string | undefined
  const userId = Cypress.env("CLERK_USER_ID") as string | undefined

  if (!secretKey || !userId) {
    throw new Error(
      "Defina CLERK_SECRET_KEY e CLERK_USER_ID no cypress.env.json antes de rodar os testes.",
    )
  }

  cy.session(
    `clerk-session-${userId}`,
    () => {
      // Passo 1 — Criar sessão real via API do Clerk
      cy.request({
        method: "POST",
        url: "https://api.clerk.com/v1/sessions",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: { user_id: userId },
      }).then((sessionRes) => {
        const sessionId = sessionRes.body.id as string
        const sessionCreatedAt = sessionRes.body.created_at as number

        // Passo 2 — Obter o JWT da sessão
        cy.request({
          method: "POST",
          url: `https://api.clerk.com/v1/sessions/${sessionId}/tokens`,
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }).then((tokenRes) => {
          const jwt = tokenRes.body.jwt as string

          // Passo 3 — Visitar o app para inicializar o Clerk no browser
          cy.visit("/")

          // Passo 4 — Injetar __session (JWT da sessão)
          cy.setCookie("__session", jwt, {
            domain: "localhost",
            path: "/",
            secure: false,
            httpOnly: false,
          })

          // Passo 5 — Injetar __client_uat (obrigatório pelo Clerk)
          // Valor em segundos — o Clerk usa para validar que a sessão é recente
          const clientUat = Math.floor(sessionCreatedAt / 1000).toString()
          cy.setCookie("__client_uat", clientUat, {
            domain: "localhost",
            path: "/",
            secure: false,
            httpOnly: false,
          })

          // Passo 6 — Confirmar acesso ao dashboard
          cy.visit("/dashboard")
          cy.url({ timeout: 15_000 }).should("include", "/dashboard")
          cy.contains(/olá/i).should("be.visible")
        })
      })
    },
    {
      validate() {
        cy.visit("/dashboard")
        cy.url().should("include", "/dashboard")
      },
      cacheAcrossSpecs: true,
    },
  )
})

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Autentica via API do Clerk (sem formulário, sem OTP).
       * Requer CLERK_SECRET_KEY e CLERK_USER_ID no cypress.env.json.
       */
      login(): Chainable<void>
    }
  }
}

export {}
