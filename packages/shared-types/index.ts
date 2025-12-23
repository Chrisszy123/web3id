export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";

// export interface Session {
//   userId: string;
//   walletAddress: string;
//   roles: Role[];
// }

// export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";

export const ROLE_HASH = {
  ADMIN: "0x" + Buffer.from("ADMIN").toString("hex"),
  DEVELOPER: "0x" + Buffer.from("DEVELOPER").toString("hex"),
  VIEWER: "0x" + Buffer.from("VIEWER").toString("hex")
};
