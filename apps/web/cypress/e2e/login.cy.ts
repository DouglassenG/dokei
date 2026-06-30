/// <reference types="cypress" />

describe("Login e Dashboard", () => {
  beforeEach(() => {
    cy.login()
  })

  it("usuário autenticado acessa o dashboard diretamente", () => {
    cy.visit("/dashboard")
    cy.url().should("include", "/dashboard")
    cy.contains(/olá/i).should("be.visible")
  })

  it("dashboard exibe as 5 funcionalidades disponíveis", () => {
    cy.visit("/dashboard")
    cy.contains("Emitir Recibo").should("be.visible")
    cy.contains("Controle Financeiro").should("be.visible")
    cy.contains("Lembretes DAS").should("be.visible")
    cy.contains("Calculadora de Preço").should("be.visible")
    cy.contains("Declaração de Rendimentos").should("be.visible")
  })

  it("sidebar exibe o email do usuário logado", () => {
    cy.visit("/dashboard")
    const email = Cypress.env("E2E_EMAIL") as string
    cy.contains(email).should("be.visible")
  })

  it("clicar em 'Emitir Recibo' navega para /recibos/novo", () => {
    cy.visit("/dashboard")
    cy.contains("Emitir Recibo").click()
    cy.url().should("include", "/recibos/novo")
  })

  it("clicar em 'Controle Financeiro' navega para /financeiro", () => {
    cy.visit("/dashboard")
    cy.contains("Controle Financeiro").click()
    cy.url().should("include", "/financeiro")
  })

  it("sidebar fica oculta no mobile e abre com o botão hamburguer", () => {
    cy.viewport(375, 812)
    cy.visit("/dashboard")

    cy.get("aside").should("have.class", "-translate-x-full")

    cy.findByRole("button", { name: /abrir menu/i }).click()

    cy.get("aside").should("not.have.class", "-translate-x-full")
  })
})

describe("Proteção de rotas", () => {
  it("visitante sem login é redirecionado para /login ao acessar /dashboard", () => {
    cy.visit("/dashboard")
    cy.url({ timeout: 10_000 }).should("include", "/login")
  })
})
