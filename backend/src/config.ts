import "dotenv/config";

export const PORT = Number(process.env.PORT || 4000);
export const SOMNIA_RPC_URL = process.env.SOMNIA_RPC_URL || "";
export const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";
export const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "";
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const DATABASE_FALLBACK_URL = process.env.DATABASE_FALLBACK_URL || "";
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
export const SERVICE_API_KEY = process.env.SERVICE_API_KEY || "";
export const TICK_AMOUNT_CNGN = process.env.TICK_AMOUNT_CNGN ? BigInt(process.env.TICK_AMOUNT_CNGN) : BigInt("100000000000000000");
