import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import {
  createAdminClient,
  createTestUser,
  ensureTestTeam,
  ensureTestPlayers,
  ensureTestMatch,
  setAllAvailable,
  TEST_EMAIL,
  TEST_PASSWORD,
} from "./helpers";

const AUTH_FILE = path.join(__dirname, ".auth/user.json");

/**
 * 1. Create test user + seed data via service_role admin API
 * 2. Log in via the UI (sets real auth cookies)
 * 3. Save storage state for all subsequent tests
 */
setup("authenticate and seed data", async ({ page }) => {
  // Ensure .auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // --- Step 1: Seed data via admin API ---
  const admin = createAdminClient();
  const userId = await createTestUser(admin);
  const team = await ensureTestTeam(admin, userId);
  const players = await ensureTestPlayers(admin, team.id, 14);
  const match = await ensureTestMatch(admin, team.id);
  await setAllAvailable(
    admin,
    match.id,
    players.map((p) => p.id)
  );

  // Store match ID for other tests
  fs.writeFileSync(
    path.join(__dirname, ".auth/test-data.json"),
    JSON.stringify({ matchId: match.id, teamId: team.id })
  );

  // --- Step 2: Log in via the UI ---
  await page.goto("/login");
  await page.getByLabel("E-mailadres").fill(TEST_EMAIL);
  await page.getByLabel("Wachtwoord").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Inloggen" }).click();

  // Wait for redirect away from login
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

  // --- Step 3: Save auth state ---
  await page.context().storageState({ path: AUTH_FILE });
});
