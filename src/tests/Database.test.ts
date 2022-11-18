import { Database } from "database";

/**
 * Database:
 * 1. Gets empty provider data
 * 2. Gets existing provider data
 * 3. Sets provider data
 * 4. Data requires refresh
 * 5. Data doesnt require refresh
 */

test("database", async () => {
  const db = new Database();
  const a = await db.getProviderDataSnapshot("d");

  console.log(a);
});
