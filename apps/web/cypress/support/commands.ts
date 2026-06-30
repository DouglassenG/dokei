/// <reference types="cypress" />

Cypress.Commands.add("login", () => {
  const email = Cypress.env("E2E_EMAIL") as string | undefined
  const password = Cypress.env("E2E_PASSWORD") as string | undefined

  if (!email || !password) {
    throw new Error(
      "Defina E2E_EMAIL e E2E_PASSWORD no cypress.env.json antes de rodar os testes.",
    )
  }

  cy.session(
    "dokei-login",
    () => {
      cy.visit("/login")

      cy.contains("h1", /entrar/i, { timeout: 15_000 }).should("be.visible")

      cy.findByLabelText(/e-?mail/i).type(email)
      cy.contains("button", "Continuar", { matchCase: false }).click()

      cy.findByLabelText(/senha/i).type(password, { log: false })
      cy.contains("button", "Continuar", { matchCase: false }).click()

      cy.url({ timeout: 20_000 }).should("include", "/dashboard")
      cy.contains(/olá/i).should("be.visible")
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
