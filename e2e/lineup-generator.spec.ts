import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

function getTestData(): { matchId: string; teamId: string } {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, ".auth/test-data.json"), "utf-8")
  );
}

test.describe("Auto-Opstelling", () => {
  let matchId: string;

  test.beforeAll(() => {
    matchId = getTestData().matchId;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/matches/${matchId}/lineup`);
    await expect(page.getByRole("button", { name: "4-3-3" })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows the Auto button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /auto/i })).toBeVisible();
  });

  test("generates a lineup when clicking Auto", async ({ page }) => {
    await page.getByRole("button", { name: /auto/i }).click();

    const pitch = page.locator(".bg-green-600");
    const filledPositions = pitch.locator(".bg-primary");
    await expect(filledPositions.first()).toBeVisible({ timeout: 5_000 });

    const count = await filledPositions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(11);
  });

  test("shows substitutes section after auto-generation", async ({ page }) => {
    await page.getByRole("button", { name: /auto/i }).click();

    await expect(page.getByText(/wissels \(\d+\)/i)).toBeVisible({
      timeout: 5_000,
    });
  });

  test("shows save button after auto-generation", async ({ page }) => {
    await page.getByRole("button", { name: /auto/i }).click();

    await expect(
      page.getByRole("button", { name: /opstelling opslaan/i })
    ).toBeVisible({ timeout: 5_000 });
  });

  test("can change formation and re-generate", async ({ page }) => {
    await page.getByRole("button", { name: /auto/i }).click();
    await expect(
      page.getByRole("button", { name: /opstelling opslaan/i })
    ).toBeVisible({ timeout: 5_000 });

    await page.getByRole("button", { name: "4-4-2" }).click();
    await page.getByRole("button", { name: /auto/i }).click();

    const pitch = page.locator(".bg-green-600");
    await expect(pitch.locator(".bg-primary").first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("bench shows available players", async ({ page }) => {
    await expect(page.getByText(/bank \(\d+\)/i)).toBeVisible({
      timeout: 5_000,
    });
  });

  test("can save the auto-generated lineup", async ({ page }) => {
    await page.getByRole("button", { name: /auto/i }).click();

    const saveButton = page.getByRole("button", {
      name: /opstelling opslaan/i,
    });
    await expect(saveButton).toBeVisible({ timeout: 5_000 });
    await saveButton.click();

    await expect(saveButton).not.toBeVisible({ timeout: 5_000 });
  });
});
