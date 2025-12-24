import { rotateRefreshToken } from "../lib/refreshToken.js";
import { issueAccessToken } from "../lib/jwt.js";

export async function refreshRoute(app: any) {
  app.post("/auth/refresh", async (req:any, reply:any) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }

    const { newToken, wallet } = await rotateRefreshToken(
      app.db,
      refreshToken
    );

    const roles = await app.roleCache.get(wallet);

    const { token: accessToken, sessionId } =
      issueAccessToken(wallet, roles);

    reply
      .setCookie("refresh_token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      })
      .send({ accessToken, sessionId });
  });
}
