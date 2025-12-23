import { v4 as uuidv4 } from "uuid";

export async function nonceRoute(app: any) {
  app.post("/auth/nonce", async (req: any) => {
    const { walletAddress } = req.body;

    const nonce = `Sign this nonce to authenticate: ${uuidv4()}`;

    // Store nonce (pseudo-code DB call)
    await app.db.nonces.upsert({
      wallet_address: walletAddress,
      nonce,
      expires_at: new Date(Date.now() + 5 * 60 * 1000)
    });

    return { nonce };
  });
}