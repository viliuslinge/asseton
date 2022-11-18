import { Database } from "database";

test("database", async () => {
  const db = new Database();
  const a = await db.getProviderDataSnapshot("d");

  console.log(a);
});
