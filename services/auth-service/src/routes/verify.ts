import jwt from "jsonwebtoken";
import { resolveRoles } from "../lib/roleResolver.js";
import { verifySignature } from "../lib/verifySignature.js";
import { Role } from "../../../../packages/shared-types/index.js";

function issueJwt(walletAddress: string, roles: Role[]) {
  return jwt.sign({ walletAddress, roles }, process.env.JWT_SECRET!);
}
export async function verifyRoute(app: any) {
  app.post("/auth/verify", async (req: any, reply: any) => {
    try {
      const { walletAddress, signature } = req.body;

      if (!walletAddress || !signature) {
        return reply.status(400).send({ error: "Missing walletAddress or signature" });
      }

      const record = await app.db.nonces.find(walletAddress);

      if (!record || new Date(record.expires_at) < new Date()) {
        await app.db.audit_logs.insert({
          event: "NONCE_EXPIRED",
          wallet_address: walletAddress,
          ip: req.ip,
        });

        return reply.status(401).send({ error: "Nonce expired" });
      }

      const isValid = await verifySignature({
        message: record.nonce,
        signature,
        address: walletAddress,
      });
      console.log('isValid', isValid);

      if (!isValid) {
        await app.db.audit_logs.insert({
          event: "SIGNATURE_FAILED",
          wallet_address: walletAddress,
          ip: req.ip,
        });

        return reply.status(401).send({ error: "Invalid signature" });
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
    } catch (error: any) {
      console.error("Verify route error:", error);
      await app.db.audit_logs.insert({
        event: "VERIFY_ERROR",
        wallet_address: req.body?.walletAddress,
        ip: req.ip,
        metadata: { error: error.message },
      });
      return reply.status(500).send({ error: error.message || "Failed to verify signature" });
    }
  });
}
