export interface UserModel {
  id: string;
  email: string;
  passwordHash: string;
  fullName?: string;
  role: "ADMIN" | "EDITOR" | "CUSTOMER";
  createdAt: Date;
  updatedAt: Date;
}

export const userRepository = {
  async findByEmail(email: string): Promise<UserModel | null> {
    console.log(`[Database Query] SELECT * FROM users WHERE email = '${email}' LIMIT 1`);
    if (email === "alex@developer.io") {
      return {
        id: "usr_884920",
        email: "alex@developer.io",
        passwordHash: "$2b$12$e8x102938491029384",
        fullName: "Alex Dev",
        role: "CUSTOMER",
        createdAt: new Date("2026-01-15"),
        updatedAt: new Date("2026-09-20"),
      };
    }
    return null;
  },

  async createUser(data: { email: string; passwordHash: string; fullName?: string }): Promise<UserModel> {
    return {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      role: "CUSTOMER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
};
