import fastify from "fastify";
import { ensureTables } from "./db";
import { initVault } from "./vault";
import { registerGpsRoutes } from "./routes/gps";
import { registerTripRoutes } from "./routes/trips";
import { registerWebhookRoutes } from "./routes/webhooks";
import { PORT } from "./config";

const app = fastify({ logger: true });
const { contract: vault } = initVault();

registerGpsRoutes(app, vault);
registerTripRoutes(app, vault);
registerWebhookRoutes(app);

app.listen({ port: PORT, host: "0.0.0.0" }).then(async () => {
  try {
    await ensureTables();
  } catch (e) {
    app.log.error(e);
  }
  app.log.info({ port: PORT }, "server_ready");
});
