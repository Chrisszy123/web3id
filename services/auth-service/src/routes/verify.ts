import * as jwt from "jsonwebtoken";
import { resolveRoles } from "../lib/roleResolver.js";
import { verifySignature } from "../lib/verifySignature.js";
import { Role } from "../../../../packages/shared-types/index.js";

function issueJwt(walletAddress: string, roles: Role[]) {
  return jwt.sign({ walletAddress, roles }, process.env.JWT_SECRET!);
}
export async function verifyRoute(app: any) {
  app.post("/auth/verify", async (req: any) => {
    const { walletAddress, signature } = req.body;

    const record = await app.db.nonces.find(walletAddress);

    if (!record || record.expires_at < new Date()) {
      await app.db.audit_logs.insert({
        event: "NONCE_EXPIRED",
        wallet_address: walletAddress,
        ip: req.ip,
      });

      throw new Error("Nonce expired");
    }

    const isValid = await verifySignature({
      message: record.nonce,
      signature,
      address: walletAddress,
    });

    if (!isValid) {
      await app.db.audit_logs.insert({
        event: "SIGNATURE_FAILED",
        wallet_address: walletAddress,
        ip: req.ip,
      });

      throw new Error("Invalid signature");
    }

    // On-chain role check here 👈
    const roles = await resolveRoles(walletAddress);

    const token = issueJwt(walletAddress, roles);

    await app.db.audit_logs.insert({
      event: "JWT_ISSUED",
      wallet_address: walletAddress,
      metadata: { roles },
    });

    return { token };
  });
}
