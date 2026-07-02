/// <reference types="cypress" />

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
      cy.request({
        method: "POST",
        url: `https://api.clerk.com/v1/sessions`,
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: { user_id: userId },
      }).then((sessionRes) => {
        const sessionId = sessionRes.body.id as string

        cy.request({
          method: "POST",
          url: `https://api.clerk.com/v1/sessions/${sessionId}/tokens`,
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }).then((tokenRes) => {
          const jwt = tokenRes.body.jwt as string

          cy.visit("/")

          cy.setCookie("__session", jwt, {
            domain: "localhost",
            path: "/",
            secure: false,
            httpOnly: false,
          })

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
      login(): Chainable<void>
    }
  }
}

export {}
