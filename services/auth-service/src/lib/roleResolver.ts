import { ROLE_HASH, Role } from "../../../../packages/shared-types/index.js";
import { ethers } from "ethers";

let provider: ethers.JsonRpcProvider | null = null;
let contract: ethers.Contract | null = null;

function getContract(): ethers.Contract {
  if (!contract) {
    if (!process.env.RPC_URL) {
      throw new Error("RPC_URL environment variable is not set");
    }
    if (!process.env.IDENTITY_CONTRACT) {
      throw new Error("IDENTITY_CONTRACT environment variable is not set");
    }
    
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    contract = new ethers.Contract(
      process.env.IDENTITY_CONTRACT,
      [
        "function hasRole(address, bytes32) view returns (bool)"
      ],
      provider
    );
  }
  return contract;
}

export async function resolveRoles(wallet: string): Promise<Role[]> {
  const contractInstance = getContract();
  const roles: Role[] = [];

  for (const role of Object.keys(ROLE_HASH) as Role[]) {
    const hasRole = await contractInstance.hasRole(wallet, ROLE_HASH[role]);
    if (hasRole) roles.push(role);
  }

  return roles;
}
