import "dotenv/config";

export const PORT = Number(process.env.PORT || 4000);
export const SOMNIA_RPC_URL = process.env.SOMNIA_RPC_URL || "";
export const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";
export const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "";
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const TICK_AMOUNT_CNGN = process.env.TICK_AMOUNT_CNGN ? BigInt(process.env.TICK_AMOUNT_CNGN) : BigInt("100000000000000000");
