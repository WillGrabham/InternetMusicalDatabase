import { TRPCError, type inferProcedureInput } from "@trpc/server";
import * as bcrypt from "bcrypt";
import { describe, expect, it, vi } from "vitest";
import { appRouter, type AppRouter } from "~/server/api/root";
import { UserRoleEnum } from "~/types/schemas";
import { prismaMock } from "../../setup";

vi.mock("bcrypt", () => ({
  hash: vi
    .fn()
    .mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
}));

const mockUser = {
  id: "user1",
  username: "testuser",
  password: "hashed_password123",
  role: UserRoleEnum.enum.USER,
};

describe("User Router", () => {
  const createCaller = (session: any = null) => {
    return appRouter.createCaller({
      db: prismaMock,
      session,
      headers: new Headers(),
    });
  };

  describe("signup", () => {
    type Input = inferProcedureInput<AppRouter["user"]["signup"]>;
    const input: Input = {
      username: "newuser",
      password: "password123",
    };

    it("should create a new user with hashed password", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null); // No existing user
      prismaMock.user.create.mockResolvedValue({
        id: "new-user-id",
        username: input.username,
        password: `hashed_${input.password}`,
        role: UserRoleEnum.enum.USER,
      });

      const caller = createCaller();

      const result = await caller.user.signup(input);

      expect(result).toEqual({
        id: "new-user-id",
        username: input.username,
        role: UserRoleEnum.enum.USER,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: input.username },
      });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: input.username,
          password: `hashed_${input.password}`,
          role: UserRoleEnum.enum.USER,
        },
      });
    });

    it("should throw CONFLICT when username already exists", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const caller = createCaller();

      await expect(caller.user.signup(input)).rejects.toThrow(TRPCError);
      await expect(caller.user.signup(input)).rejects.toThrow(
        /Username already exists/,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: input.username },
      });
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it("should validate input data", async () => {
      const caller = createCaller();

      // Test with invalid username (too short)
      const invalidUsernameInput = { ...input, username: "ab" };
      await expect(caller.user.signup(invalidUsernameInput)).rejects.toThrow();

      // Test with invalid password (too short)
      const invalidPasswordInput = { ...input, password: "short" };
      await expect(caller.user.signup(invalidPasswordInput)).rejects.toThrow();
    });
  });
});
