import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { dbQuery, execSql } from "./db";

const MIGRATIONS_TABLE = "schema_migrations";

async function ensureMigrationsTable() {
  await execSql(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function isApplied(version: string): Promise<boolean> {
  const rows = await dbQuery((sql: any) => sql<{ version: string }[]>`
    SELECT version
    FROM schema_migrations
    WHERE version = ${version}
    LIMIT 1
  `) as Array<{ version: string }>;
  return rows.length > 0;
}

async function markApplied(version: string) {
  await dbQuery((sql: any) => sql`
    INSERT INTO schema_migrations (version)
    VALUES (${version})
    ON CONFLICT (version) DO NOTHING
  `);
}

export async function runMigrations() {
  await ensureMigrationsTable();
  const dir = path.join(process.cwd(), "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    if (await isApplied(version)) continue;
    const filePath = path.join(dir, file);
    const sqlText = await readFile(filePath, "utf8");
    await execSql(sqlText);
    await markApplied(version);
  }
}
