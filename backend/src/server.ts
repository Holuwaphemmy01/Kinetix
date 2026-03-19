import fastify from "fastify";
import rawBody from "fastify-raw-body";
import { checkDbConnection } from "./db";
import { initVault } from "./vault";
import { registerGpsRoutes } from "./routes/gps";
import { registerTripRoutes } from "./routes/trips";
import { registerWebhookRoutes } from "./routes/webhooks";
import { registerHealthRoutes } from "./routes/health";
import { PORT } from "./config";
import { runMigrations } from "./migrations";
import { setupQueue } from "./queue";

const app = fastify({ logger: true });
const { contract: vault, provider } = initVault();

app.register(rawBody, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true,
  routes: ["/api/webhooks/paystack"]
});

registerGpsRoutes(app, vault);
registerTripRoutes(app, vault);
registerWebhookRoutes(app, vault);
registerHealthRoutes(app, { provider, vault });

async function initDbWithRetry() {
  const maxAttempts = 5;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      await runMigrations();
      const ok = await checkDbConnection();
      app.log.info({ db_connected: ok, attempt }, "db_check");
      if (ok) {
        if (vault) {
          await setupQueue(vault, app.log);
        } else {
          app.log.warn("queue_not_started_vault_missing");
        }
        return;
      }
    } catch (e) {
      app.log.error({ err: e, attempt }, "db_init_error");
    }
    attempt++;
    await new Promise((res) => setTimeout(res, 2000 * attempt));
  }
  app.log.warn("db_not_connected_after_retries");
}

app.listen({ port: PORT, host: "0.0.0.0" }).then(async () => {
  initDbWithRetry();
  app.log.info({ port: PORT }, "server_ready");
});
