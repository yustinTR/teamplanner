import { test as teardown } from "@playwright/test";
import { createAdminClient, deleteTestUser } from "./helpers";

/**
 * Clean up: remove the test user and all related data after e2e tests.
 */
teardown("cleanup test data", async () => {
  try {
    const admin = createAdminClient();
    await deleteTestUser(admin);
  } catch (error) {
    console.warn("Cleanup warning:", error);
  }
});
