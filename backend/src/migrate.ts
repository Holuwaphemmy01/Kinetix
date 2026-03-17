import { runMigrations } from "./migrations";

runMigrations()
  .then(() => {
    console.log("migrations_ok");
    process.exit(0);
  })
  .catch((e: unknown) => {
    console.error("migrations_failed", e);
    process.exit(1);
  });
