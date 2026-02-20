import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests for TeamPlanner.
 *
 * Runs against the hosted Supabase instance. Uses the service_role key
 * to create/manage test users without email confirmation.
 *
 * Required env vars (set as GitHub Secrets for CI):
 *   SUPABASE_SERVICE_ROLE_KEY  — admin key for user management
 *
 * Already available from .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Run locally:  SUPABASE_SERVICE_ROLE_KEY=... npm run test:e2e
 * Run in CI:    Secrets are injected automatically
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",
  timeout: 30_000,

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "e2e",
      use: {
        ...devices["Pixel 7"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "teardown",
      testMatch: /cleanup\.teardown\.ts/,
      dependencies: ["e2e"],
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
