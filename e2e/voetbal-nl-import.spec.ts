import { test, expect } from "@playwright/test";

test.describe("Club Website Import", () => {
  test("team settings page has import link", async ({ page }) => {
    await page.goto("/team/settings");

    await expect(
      page.getByRole("link", { name: /import van clubwebsite/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("import link navigates to import page", async ({ page }) => {
    await page.goto("/team/settings");

    await page
      .getByRole("link", { name: /import van clubwebsite/i })
      .click();

    await expect(page).toHaveURL(/\/team\/settings\/import/);
    await expect(
      page.getByRole("heading", { name: /import van clubwebsite/i })
    ).toBeVisible();
  });

  test("import page shows URL form", async ({ page }) => {
    await page.goto("/team/settings/import");

    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByRole("button", { name: /club zoeken/i })
    ).toBeVisible();
  });

  test("form validates required URL field", async ({ page }) => {
    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({
      timeout: 10_000,
    });

    await page.getByRole("button", { name: /club zoeken/i }).click();

    // HTML5 validation prevents submit — stays on same page
    await expect(page).toHaveURL(/\/team\/settings\/import/);
  });

  test("shows team selector after successful discovery", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [
              { name: "cvv Be Fair 1", id: 2 },
              { name: "cvv Be Fair G1", id: 41 },
              { name: "cvv Be Fair G2", id: 11 },
            ],
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();

    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel("Team")).toBeVisible();
    await expect(page.getByRole("button", { name: /gegevens ophalen/i })).toBeVisible();
  });

  test("shows preview after selecting team and fetching", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [
              { name: "cvv Be Fair G2", id: 11 },
            ],
          }),
        });
      }
      if (body.action === "import") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              teamName: "cvv Be Fair G2",
              matches: [
                { date: "28-02-2026 11:30", opponent: "DVV Delft G5JM", homeAway: "away", location: "Sportpark Kerkpolder" },
                { date: "14-03-2026 09:15", opponent: "SEV G3", homeAway: "away", location: null },
              ],
              results: [],
              players: [],
            },
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    // Step 1: Enter URL
    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();

    // Step 2: Select team and import
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /gegevens ophalen/i }).click();

    // Step 3: Preview
    await expect(page.getByText("cvv Be Fair G2")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("DVV Delft G5JM")).toBeVisible();
    await expect(page.getByText("SEV G3")).toBeVisible();
    await expect(page.getByText(/wedstrijden \(2\/2\)/i)).toBeVisible();
  });

  test("can deselect items in preview", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [{ name: "cvv Be Fair G2", id: 11 }],
          }),
        });
      }
      if (body.action === "import") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              teamName: "cvv Be Fair G2",
              matches: [
                { date: "28-02-2026 11:30", opponent: "DVV Delft G5JM", homeAway: "away", location: null },
                { date: "14-03-2026 09:15", opponent: "SEV G3", homeAway: "away", location: null },
              ],
              results: [],
              players: [],
            },
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /gegevens ophalen/i }).click();

    await expect(page.getByText("DVV Delft G5JM")).toBeVisible({ timeout: 10_000 });

    const checkbox = page.locator("label").filter({ hasText: "DVV Delft G5JM" }).getByRole("checkbox");
    await checkbox.uncheck();

    await expect(page.getByText(/wedstrijden \(1\/2\)/i)).toBeVisible();
  });

  test("includes manually entered player names in preview", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [{ name: "cvv Be Fair G2", id: 11 }],
          }),
        });
      }
      if (body.action === "import") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              teamName: "cvv Be Fair G2",
              matches: [
                { date: "28-02-2026 11:30", opponent: "DVV Delft G5JM", homeAway: "away", location: null },
              ],
              results: [],
              players: [],
            },
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });

    // Enter player names
    await page.getByLabel(/spelernamen/i).fill("Dennis Hazekamp\nWouter Kelder\nAnoniem");
    await page.getByRole("button", { name: /gegevens ophalen/i }).click();

    // Preview should show matches AND players (Anoniem filtered out)
    await expect(page.getByText("DVV Delft G5JM")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Dennis Hazekamp")).toBeVisible();
    await expect(page.getByText("Wouter Kelder")).toBeVisible();
    await expect(page.getByText(/spelers \(2\/2\)/i)).toBeVisible();
    // Anoniem should not appear
    await expect(page.getByText("Anoniem")).not.toBeVisible();
  });

  test("shows error on discovery failure", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Kon geen VoetbalAssist-data vinden voor deze website.",
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.example.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();

    await expect(page.getByText(/kon geen voetbalassist-data vinden/i)).toBeVisible({ timeout: 10_000 });
  });

  test("can go back from team selection to URL form", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [{ name: "cvv Be Fair G2", id: 11 }],
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /terug/i }).click();

    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /club zoeken/i })).toBeVisible();
  });

  test("can cancel preview and go back to team selection", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [{ name: "cvv Be Fair G2", id: 11 }],
          }),
        });
      }
      if (body.action === "import") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              teamName: "cvv Be Fair G2",
              matches: [],
              results: [],
              players: [],
            },
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /gegevens ophalen/i }).click();

    await expect(page.getByText(/geen wedstrijden of spelers gevonden/i)).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /annuleren/i }).click();
    await expect(page.getByText(/club gevonden/i)).toBeVisible();
  });

  test("can confirm import and see success", async ({ page }) => {
    await page.route("**/api/import-voetbal-nl", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}");
      if (body.action === "discover") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            clubAbbrev: "BeFair",
            teams: [{ name: "cvv Be Fair G2", id: 11 }],
          }),
        });
      }
      if (body.action === "import") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              teamName: "cvv Be Fair G2",
              matches: [
                { date: "28-02-2026 11:30", opponent: "DVV Delft G5JM", homeAway: "away", location: "Sportpark Kerkpolder" },
                { date: "14-03-2026 09:15", opponent: "SEV G3", homeAway: "away", location: null },
              ],
              results: [],
              players: [],
            },
          }),
        });
      }
      if (route.request().url().includes("/confirm")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            results: { matchesCreated: 2, playersCreated: 0, errors: [] },
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/team/settings/import");
    await expect(page.getByLabel(/clubwebsite url/i)).toBeVisible({ timeout: 10_000 });

    // Step 1: Discover
    await page.getByLabel(/clubwebsite url/i).fill("https://www.cvvbefair.com");
    await page.getByRole("button", { name: /club zoeken/i }).click();

    // Step 2: Select team
    await expect(page.getByText(/club gevonden/i)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /gegevens ophalen/i }).click();

    // Step 3: Preview + confirm
    await expect(page.getByText("DVV Delft G5JM")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /importeren$/i }).click();

    // Step 4: Success
    await expect(page.getByText(/import geslaagd/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/2 wedstrijden aangemaakt/i)).toBeVisible();
  });
});
