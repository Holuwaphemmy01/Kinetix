import { ethers } from "ethers";
import abi from "./abi/KinetixVault.json";
import { SOMNIA_RPC_URL, RELAYER_PRIVATE_KEY, VAULT_ADDRESS } from "./config";

export type VaultDeps = {
  provider: ethers.JsonRpcProvider | null;
  wallet: ethers.Wallet | null;
  contract: ethers.Contract | null;
};

export function initVault(): VaultDeps {
  const provider = SOMNIA_RPC_URL ? new ethers.JsonRpcProvider(SOMNIA_RPC_URL) : null;
  const wallet = provider && RELAYER_PRIVATE_KEY ? new ethers.Wallet(RELAYER_PRIVATE_KEY, provider) : null;
  const contract = wallet && VAULT_ADDRESS ? new ethers.Contract(VAULT_ADDRESS, abi, wallet) : null;
  return { provider, wallet, contract };
}

export function toIdHex(id: string) {
  return ethers.isHexString(id, 32) ? id : ethers.id(id);
}
