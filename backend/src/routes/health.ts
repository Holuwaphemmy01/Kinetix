import type { FastifyInstance } from "fastify";
import { checkDbConnection } from "../db";

export function registerHealthRoutes(app: FastifyInstance, deps: { provider: any; vault: any }) {
  app.get("/health/db", async (_req, reply) => {
    const connected = await checkDbConnection();
    return reply.send({ ok: connected, db_connected: connected });
  });

  app.get("/health/chain", async (_req, reply) => {
    if (!deps.provider) {
      return reply.status(503).send({ ok: false, error: "provider_not_configured" });
    }
    try {
      const blockNumber = await deps.provider.getBlockNumber();
      const vaultConfigured = !!deps.vault;
      const vaultAddress = vaultConfigured ? await deps.vault.getAddress() : null;
      return reply.send({
        ok: true,
        blockNumber,
        vaultConfigured,
        vaultAddress
      });
    } catch (e) {
      return reply.status(503).send({ ok: false, error: "chain_unreachable" });
    }
  });
}
