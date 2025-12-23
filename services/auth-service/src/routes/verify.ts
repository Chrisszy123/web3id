import jwt from "jsonwebtoken";
import { verifySignature } from "../lib/verifySignature";
export async function verifyRoute(app: any) {
  app.post("/auth/verify", async (req: any) => {
    const { walletAddress, signature } = req.body;

    const record = await app.db.nonces.find(walletAddress);
    if (!record) throw new Error("Nonce not found");

    // Call Rust verifier
    const verified = await verifySignature({
      address: walletAddress,
      message: record.nonce,
      signature
    });

    if (!verified) throw new Error("Invalid signature");

    // Delete nonce (replay protection)
    await app.db.nonces.delete(walletAddress);

    const token = jwt.sign(
      { walletAddress },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return { token };
  });
}
