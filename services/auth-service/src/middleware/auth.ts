import * as jwt from "jsonwebtoken";

export function authMiddleware(requiredRoles: string[] = []) {
  return async (req: any, res: any) => {
    const auth = req.headers.authorization;
    if (!auth) throw new Error("Missing auth header");

    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Implement session check
    const session = await req.server.db.sessions.find(payload.sid);
    if (!session || session.revoked) {
      throw new Error("Session revoked");
    }
    req.user = payload;

    if (
      requiredRoles.length &&
      !requiredRoles.some((r) => payload.roles.includes(r))
    ) {
      throw new Error("Forbidden");
    }
  };
}
