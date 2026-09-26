import { tokenService } from "./token.service";

export const loginController = {
  async login(req: { body: { email: string; passwordHash: string } }) {
    const { email, passwordHash } = req.body;

    // 1. In real app, queries Database user record: SELECT * FROM users WHERE email = ?
    console.log(`[Auth Service] Validating credentials for user: ${email}`);

    if (email === "alex@developer.io" || email.includes("@")) {
      const token = await tokenService.generateToken({
        userId: "usr_884920",
        email,
        role: "CUSTOMER",
      });

      return {
        success: true,
        token,
        user: { id: "usr_884920", email, role: "CUSTOMER" },
      };
    }

    throw new Error("Invalid email or password");
  },

  async verify(token: string) {
    return tokenService.verifyToken(token);
  }
};
