import { test as setup, expect } from "@playwright/test"
import { STORAGE_STATE } from "../../playwright.config"

setup("autenticar e salvar sessão", async ({ page }) => {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  if (!email || !password) {
    throw new Error(
      "Defina E2E_EMAIL e E2E_PASSWORD no arquivo .env.test antes de rodar os testes.",
    )
  }

  await page.goto("/login")

  await expect(
    page.getByRole("heading", { name: /entrar/i }),
  ).toBeVisible({ timeout: 15_000 })

  await page.getByLabel(/e-?mail/i).fill(email)
  await page.getByRole("button", { name: /continuar/i }).click()

  await page.getByLabel(/senha/i).fill(password)
  await page.getByRole("button", { name: /entrar/i }).click()

  await page.waitForURL("**/dashboard", { timeout: 20_000 })

  await expect(page.getByText(/olá/i)).toBeVisible()

  await page.context().storageState({ path: STORAGE_STATE })
})
