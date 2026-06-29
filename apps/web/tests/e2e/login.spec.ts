import { test, expect } from "@playwright/test"

test.describe("Login e Dashboard", () => {
  test("usuário autenticado acessa o dashboard diretamente", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText(/olá/i)).toBeVisible()
  })

  test("dashboard exibe as 5 funcionalidades disponíveis", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByText("Emitir Recibo")).toBeVisible()
    await expect(page.getByText("Controle Financeiro")).toBeVisible()
    await expect(page.getByText("Lembretes DAS")).toBeVisible()
    await expect(page.getByText("Calculadora de Preço")).toBeVisible()
    await expect(page.getByText("Declaração de Rendimentos")).toBeVisible()
  })

  test("sidebar exibe o email do usuário logado", async ({ page }) => {
    await page.goto("/dashboard")
    const email = process.env.E2E_EMAIL ?? ""
    await expect(page.getByText(email)).toBeVisible()
  })

  test("visitante sem login é redirecionado para /login ao acessar /dashboard", async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
    await context.close()
  })

  test("clicar em 'Emitir Recibo' navega para /recibos/novo", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByText("Emitir Recibo").click()
    await expect(page).toHaveURL(/\/recibos\/novo/)
  })

  test("clicar em 'Controle Financeiro' navega para /financeiro", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByText("Controle Financeiro").click()
    await expect(page).toHaveURL(/\/financeiro/)
  })

  test("sidebar fica oculta no mobile e abre com o botão hamburguer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/dashboard")
    const aside = page.locator("aside")
    await expect(aside).toHaveClass(/-translate-x-full/)
    await page.getByRole("button", { name: /abrir menu/i }).click()
    await expect(aside).not.toHaveClass(/-translate-x-full/)
  })
})
