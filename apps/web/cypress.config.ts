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
      config.env.CLERK_SECRET_KEY =
        config.env.CLERK_SECRET_KEY ?? process.env.CLERK_SECRET_KEY
      config.env.CLERK_USER_ID =
        config.env.CLERK_USER_ID ?? process.env.CLERK_USER_ID
      return config
    },
  },
})
