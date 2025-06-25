import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { UserRoleEnum } from "~/types/schemas";
import { prismaMock } from "../../setup";

describe("tRPC Procedures", () => {
  const testRouter = createTRPCRouter({
    publicRoute: publicProcedure.query(() => {
      return { success: true };
    }),
    protectedRoute: protectedProcedure.query(() => {
      return { success: true };
    }),
    adminRoute: adminProcedure.query(() => {
      return { success: true };
    }),
  });

  const createCaller = (session: any = null) => {
    return testRouter.createCaller({
      db: prismaMock,
      session,
      headers: new Headers(),
    });
  };

  const mockAdminUser = {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: UserRoleEnum.enum.ADMIN,
  };

  const mockRegularUser = {
    id: "user1",
    name: "Regular User",
    email: "user@example.com",
    role: UserRoleEnum.enum.USER,
  };

  describe("publicProcedure", () => {
    it("should be accessible without authentication", async () => {
      const caller = createCaller(null);

      const result = await caller.publicRoute();

      expect(result).toEqual({ success: true });
    });

    it("should be accessible with authentication", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      const result = await caller.publicRoute();

      expect(result).toEqual({ success: true });
    });
  });

  describe("protectedProcedure", () => {
    it("should throw UNAUTHORIZED when user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(caller.protectedRoute()).rejects.toThrow(TRPCError);
      await expect(caller.protectedRoute()).rejects.toThrow("UNAUTHORIZED");
    });

    it("should be accessible when user is logged in", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      const result = await caller.protectedRoute();

      expect(result).toEqual({ success: true });
    });

    it("should be accessible when user is admin", async () => {
      const caller = createCaller({
        user: mockAdminUser,
      });

      const result = await caller.protectedRoute();

      expect(result).toEqual({ success: true });
    });
  });

  describe("adminProcedure", () => {
    it("should throw UNAUTHORIZED when user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(caller.adminRoute()).rejects.toThrow(TRPCError);
      await expect(caller.adminRoute()).rejects.toThrow("UNAUTHORIZED");
    });

    it("should throw FORBIDDEN when user is not admin", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      await expect(caller.adminRoute()).rejects.toThrow(TRPCError);
      await expect(caller.adminRoute()).rejects.toThrow(
        /Admin access required/,
      );
    });

    it("should be accessible when user is admin", async () => {
      const caller = createCaller({
        user: mockAdminUser,
      });

      const result = await caller.adminRoute();

      expect(result).toEqual({ success: true });
    });
  });
});
