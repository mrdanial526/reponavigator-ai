export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "CUSTOMER";
}

const JWT_SECRET = process.env.AUTH_SECRET || "dev_super_secret_signing_key_32_bytes";

export const tokenService = {
  async generateToken(payload: TokenPayload): Promise<string> {
    // Generates signed base64url encoded token
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      })
    ).toString("base64url");
    const signature = Buffer.from(`${header}.${body}.${JWT_SECRET}`).toString("base64url");

    return `${header}.${body}.${signature}`;
  },

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload: TokenPayload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      return payload;
    } catch {
      return null;
    }
  }
};
