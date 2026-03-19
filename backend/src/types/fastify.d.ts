import "fastify";
import type { UserRole } from "../db";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: {
      userId: number;
      role: UserRole;
    };
  }
}
