export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";

// export interface Session {
//   userId: string;
//   walletAddress: string;
//   roles: Role[];
// }

// export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";

// Helper function to create a bytes32 hash from a string
function toBytes32(str: string): string {
  const hex = Buffer.from(str).toString("hex");
  // Pad to 64 characters (32 bytes) - bytes32 requires exactly 32 bytes
  const padded = hex.padEnd(64, "0");
  return "0x" + padded;
}

export const ROLE_HASH = {
  ADMIN: toBytes32("ADMIN"),
  DEVELOPER: toBytes32("DEVELOPER"),
  VIEWER: toBytes32("VIEWER")
};
