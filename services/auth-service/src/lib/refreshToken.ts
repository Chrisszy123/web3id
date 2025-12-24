import crypto from "crypto";
import { hashToken } from "./crypto.js";

export async function rotateRefreshToken(db: any, oldToken: string) {
  const record = await db.refresh_tokens.findByHash(hashToken(oldToken));

  if (!record || record.revoked || record.expires_at < new Date()) {
    throw new Error("Invalid refresh token");
  }

  await db.refresh_tokens.update(record.id, {
    revoked: true,
  });

  const newToken = crypto.randomUUID();

  await db.refresh_tokens.insert({
    wallet_address: record.wallet_address,
    token_hash: hashToken(newToken),
    expires_at: new Date(Date.now() + 14 * 86400 * 1000),
    replaced_by: record.id,
  });

  return {
    newToken,
    wallet: record.wallet_address,
  };
}
