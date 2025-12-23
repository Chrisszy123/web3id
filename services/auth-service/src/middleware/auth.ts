import * as jwt from "jsonwebtoken";

export function authMiddleware(requiredRoles: string[] = []) {
  return async (req: any, res: any) => {
    const auth = req.headers.authorization;
    if (!auth) throw new Error("Missing auth header");

    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    req.user = payload;

    if (
      requiredRoles.length &&
      !requiredRoles.some(r => payload.roles.includes(r))
    ) {
      throw new Error("Forbidden");
    }
  };
}
