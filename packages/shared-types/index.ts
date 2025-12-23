export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";

export interface Session {
  userId: string;
  walletAddress: string;
  roles: Role[];
}