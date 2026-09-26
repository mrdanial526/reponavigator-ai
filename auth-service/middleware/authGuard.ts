import { tokenService, TokenPayload } from "../login/token.service";

export async function authGuard(req: { headers: { authorization?: string }; user?: TokenPayload }): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = await tokenService.verifyToken(token);

  if (!payload) {
    throw new Error("Invalid or expired session token");
  }

  req.user = payload;
  return true;
}
