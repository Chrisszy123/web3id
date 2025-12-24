import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Role } from "../../../../packages/shared-types/index.js";

export function issueAccessToken(wallet: string, roles: Role[]) {
  const sessionId = crypto.randomUUID();

  return {
    token: jwt.sign(
      { sub: wallet, roles, sid: sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    ),
    sessionId
  };
}