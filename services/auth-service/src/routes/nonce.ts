import { v4 as uuidv4 } from "uuid";

export async function nonceRoute(app: any) {
  app.post(
    "/auth/nonce",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
          keyGenerator: (req: any) => {
            return `${req.ip}:${req.body?.walletAddress}`;
          },
        },
      },
    },
    async (req: any) => {
      const { walletAddress } = req.body;

      const nonce = `Sign this nonce to authenticate: ${uuidv4()}`;
      console.log('nonce generated', nonce);
      // Store nonce (pseudo-code DB call)
      await app.db.nonces.upsert({
        wallet_address: walletAddress,
        nonce,
        expires_at: new Date(Date.now() + 5 * 60 * 1000),
      });
      console.log('nonce stored', nonce);
      return { nonce };
    }
  );
}
