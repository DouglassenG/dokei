# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> autenticar e salvar sessão
- Location: tests\e2e\auth.setup.ts:4:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - link "Voltar ao site" [ref=e7] [cursor=pointer]:
      - /url: /
      - img [ref=e8]
      - text: Voltar ao site
    - generic [ref=e10]:
      - img "Dokei" [ref=e11]
      - paragraph [ref=e12]: Gestão simples para MEI
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e18]:
          - heading "Entrar" [level=1] [ref=e19]
          - paragraph [ref=e20]: para continuar em dokei
        - generic [ref=e21]:
          - button "Sign in with Google Continuar com Google" [ref=e24] [cursor=pointer]:
            - generic [ref=e25]:
              - generic "Sign in with Google" [ref=e27]
              - generic [ref=e28]: Continuar com Google
          - paragraph [ref=e31]: ou
          - generic [ref=e33]:
            - generic [ref=e34]:
              - generic [ref=e36]:
                - generic [ref=e37]:
                  - generic [ref=e39]: Seu e-mail
                  - textbox "Seu e-mail" [invalid] [ref=e40]:
                    - /placeholder: Digite o endereço de e-mail
                    - text: teste@dokei.com.br
                - generic [ref=e41]: Não foi possível encontrar o usuário.
                - paragraph [ref=e43]:
                  - img [ref=e44]
                  - text: Não foi possível encontrar o usuário.
              - generic [ref=e48]:
                - generic [ref=e49]:
                  - generic [ref=e50]: Senha
                  - link "Esqueceu a senha?" [ref=e51] [cursor=pointer]:
                    - /url: ""
                - generic [ref=e52]:
                  - textbox "Senha" [ref=e53]:
                    - /placeholder: Digite sua senha
                    - text: suasenha123
                  - button "Show password" [ref=e54] [cursor=pointer]:
                    - img [ref=e55]
            - button "Continuar" [ref=e60] [cursor=pointer]:
              - generic [ref=e61]:
                - text: Continuar
                - img [ref=e62]
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e66]: Não possui uma conta?
          - link "Registre-se" [ref=e67] [cursor=pointer]:
            - /url: http://localhost:3000/cadastro
        - generic [ref=e69]:
          - generic [ref=e71]:
            - paragraph [ref=e72]: Secured by
            - link "Clerk logo" [ref=e73] [cursor=pointer]:
              - /url: https://go.clerk.com/components
              - img [ref=e74]
          - paragraph [ref=e79]: Development mode
  - button "Abrir chat de suporte" [ref=e80]:
    - img [ref=e81]
  - button "Open Next.js Dev Tools" [ref=e88] [cursor=pointer]:
    - img [ref=e89]
  - alert [ref=e92]
```

# Test source

```ts
  1  | import { test as setup, expect } from "@playwright/test"
  2  | import { STORAGE_STATE } from "../../playwright.config"
  3  | 
  4  | setup("autenticar e salvar sessão", async ({ page }) => {
  5  |   const email = process.env.E2E_EMAIL
  6  |   const password = process.env.E2E_PASSWORD
  7  | 
  8  |   if (!email || !password) {
  9  |     throw new Error(
  10 |       "Defina E2E_EMAIL e E2E_PASSWORD no arquivo .env.test antes de rodar os testes.",
  11 |     )
  12 |   }
  13 | 
  14 |   await page.goto("/login")
  15 | 
  16 |   await expect(
  17 |     page.getByRole("heading", { name: /entrar/i }),
  18 |   ).toBeVisible({ timeout: 15_000 })
  19 | 
  20 |   await page.getByLabel(/e-?mail/i).fill(email)
  21 |   await page.getByRole("button", { name: "Continuar", exact: true }).click()
  22 | 
  23 |   await page.getByLabel(/senha/i).fill(password)
  24 |   await page.getByRole("button", { name: "Continuar", exact: true }).click()
  25 | 
> 26 |   await page.waitForURL("**/dashboard", { timeout: 20_000 })
     |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  27 | 
  28 |   await expect(page.getByText(/olá/i)).toBeVisible()
  29 | 
  30 |   await page.context().storageState({ path: STORAGE_STATE })
  31 | })
  32 | 
```