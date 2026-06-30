import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {},
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10_000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      config.env.E2E_EMAIL = config.env.E2E_EMAIL ?? process.env.E2E_EMAIL
      config.env.E2E_PASSWORD =
        config.env.E2E_PASSWORD ?? process.env.E2E_PASSWORD
      return config
    },
  },
})
