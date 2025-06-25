import { TRPCError, type inferProcedureInput } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { appRouter, type AppRouter } from "~/server/api/root";
import { UserRoleEnum } from "~/types/schemas";
import { prismaMock } from "../../setup";

const mockMusical = {
  id: "cldkw8ym10000jl08o61sbqo1",
  title: "Test Musical",
  description: "A test musical description",
  posterUrl: "https://example.com/poster.jpg",
  releaseDate: new Date("2025-01-01"),
  createdBy: "cldkw8ym10000jl08o61sbqo2",
  createdAt: new Date(),
  updatedAt: new Date(),
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

describe("Musical Router", () => {
  // Helper to create a caller with the given session
  const createCaller = (session: any = null) => {
    return appRouter.createCaller({
      db: prismaMock,
      session,
      headers: new Headers(),
    });
  };

  describe("createMusical", () => {
    type Input = inferProcedureInput<AppRouter["musical"]["createMusical"]>;
    const input: Input = {
      title: "New Musical",
      description: "A brand new musical description",
      posterUrl: "https://example.com/new-poster.jpg",
      releaseDate: new Date("2025-06-01"),
    };

    it("should create a musical when user is admin", async () => {
      prismaMock.musical.create.mockResolvedValue({
        ...mockMusical,
        ...input,
        id: "new-musical-id",
        createdBy: mockAdminUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const caller = createCaller({
        user: mockAdminUser,
      });

      const result = await caller.musical.createMusical(input);

      expect(result).toMatchObject({
        ...input,
        id: "new-musical-id",
        createdBy: mockAdminUser.id,
      });

      expect(prismaMock.musical.create).toHaveBeenCalledWith({
        data: {
          ...input,
          createdBy: mockAdminUser.id,
        },
      });
    });

    it("should throw UNAUTHORIZED when user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(caller.musical.createMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.createMusical(input)).rejects.toThrow(
        "UNAUTHORIZED",
      );
    });

    it("should throw FORBIDDEN when user is not admin", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      await expect(caller.musical.createMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.createMusical(input)).rejects.toThrow(
        /Admin access required/,
      );
    });
  });

  describe("updateMusical", () => {
    type Input = inferProcedureInput<AppRouter["musical"]["updateMusical"]>;
    const input: Input = {
      id: "cldkw8ym10000jl08o61sbqo1",
      data: {
        title: "Updated Musical",
        description: "Updated description",
      },
    };

    it("should update a musical when user is admin", async () => {
      prismaMock.musical.findUnique.mockResolvedValue(mockMusical);
      prismaMock.musical.update.mockResolvedValue({
        ...mockMusical,
        title: "Updated Musical",
        description: "Updated description",
      });

      const caller = createCaller({
        user: mockAdminUser,
      });

      const result = await caller.musical.updateMusical(input);

      expect(result).toMatchObject({
        ...mockMusical,
        title: "Updated Musical",
        description: "Updated description",
      });

      expect(prismaMock.musical.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
      expect(prismaMock.musical.update).toHaveBeenCalledWith({
        where: { id: input.id },
        data: input.data,
      });
    });

    it("should throw NOT_FOUND when musical does not exist", async () => {
      prismaMock.musical.findUnique.mockResolvedValue(null);

      const caller = createCaller({
        user: mockAdminUser,
      });

      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        /Musical not found/,
      );
    });

    it("should throw UNAUTHORIZED when user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        "UNAUTHORIZED",
      );
    });

    it("should throw FORBIDDEN when user is not admin", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.updateMusical(input)).rejects.toThrow(
        /Admin access required/,
      );
    });
  });

  describe("deleteMusical", () => {
    type Input = inferProcedureInput<AppRouter["musical"]["deleteMusical"]>;
    const input: Input = {
      id: "cldkw8ym10000jl08o61sbqo1",
    };

    it("should delete a musical when user is admin", async () => {
      prismaMock.musical.findUnique.mockResolvedValue(mockMusical);
      prismaMock.musical.delete.mockResolvedValue(mockMusical);

      const caller = createCaller({
        user: mockAdminUser,
      });

      const result = await caller.musical.deleteMusical(input);

      expect(result).toEqual(mockMusical);

      expect(prismaMock.musical.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
      expect(prismaMock.musical.delete).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });

    it("should throw NOT_FOUND when musical does not exist", async () => {
      prismaMock.musical.findUnique.mockResolvedValue(null);

      const caller = createCaller({
        user: mockAdminUser,
      });

      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        /Musical not found/,
      );
    });

    it("should throw UNAUTHORIZED when user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        "UNAUTHORIZED",
      );
    });

    it("should throw FORBIDDEN when user is not admin", async () => {
      const caller = createCaller({
        user: mockRegularUser,
      });

      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        TRPCError,
      );
      await expect(caller.musical.deleteMusical(input)).rejects.toThrow(
        /Admin access required/,
      );
    });
  });

  describe("getMusical", () => {
    type Input = inferProcedureInput<AppRouter["musical"]["getMusical"]>;
    const input: Input = {
      id: "cldkw8ym10000jl08o61sbqo1",
    };

    it("should return a musical when it exists and is released", async () => {
      const releasedMusical = {
        ...mockMusical,
        releaseDate: new Date("2020-01-01"), // Past date
      };
      prismaMock.musical.findUnique.mockResolvedValue(releasedMusical);

      const caller = createCaller(null);

      const result = await caller.musical.getMusical(input);

      expect(result).toEqual(releasedMusical);

      expect(prismaMock.musical.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });

    it("should throw NOT_FOUND when musical does not exist", async () => {
      prismaMock.musical.findUnique.mockResolvedValue(null);

      const caller = createCaller(null);

      await expect(caller.musical.getMusical(input)).rejects.toThrow(TRPCError);
      await expect(caller.musical.getMusical(input)).rejects.toThrow(
        /Musical not found/,
      );
    });

    it("should throw FORBIDDEN for unreleased musical when user is not logged in", async () => {
      const unreleaseMusical = {
        ...mockMusical,
        releaseDate: new Date("2030-01-01"), // Future date
      };
      prismaMock.musical.findUnique.mockResolvedValue(unreleaseMusical);

      const caller = createCaller(null);

      await expect(caller.musical.getMusical(input)).rejects.toThrow(TRPCError);
      await expect(caller.musical.getMusical(input)).rejects.toThrow(
        /This musical has not been released yet/,
      );
    });

    it("should return an unreleased musical when user is logged in", async () => {
      const unreleaseMusical = {
        ...mockMusical,
        releaseDate: new Date("2030-01-01"), // Future date
      };
      prismaMock.musical.findUnique.mockResolvedValue(unreleaseMusical);

      const caller = createCaller({
        user: mockRegularUser,
      });

      const result = await caller.musical.getMusical(input);

      expect(result).toEqual(unreleaseMusical);
    });
  });

  describe("getMusicals", () => {
    type Input = inferProcedureInput<AppRouter["musical"]["getMusicals"]>;

    it("should return released musicals for public users", async () => {
      const musicals = [
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo3",
          releaseDate: new Date("2020-01-01"),
        },
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo4",
          releaseDate: new Date("2021-01-01"),
        },
      ];
      prismaMock.musical.findMany.mockResolvedValue(musicals);

      const caller = createCaller(null);

      const result = await caller.musical.getMusicals({});

      expect(result).toEqual({
        musicals,
        nextCursor: undefined,
      });

      expect(prismaMock.musical.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            releaseDate: expect.any(Object),
          }),
        }),
      );
    });

    it("should handle pagination correctly", async () => {
      // Setup mock with more items than the limit
      const limit = 2;
      const musicals = [
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo5",
          releaseDate: new Date("2022-01-01"),
        },
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo6",
          releaseDate: new Date("2021-01-01"),
        },
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo7",
          releaseDate: new Date("2020-01-01"),
        },
      ];

      const returnedMusicals = musicals.slice(0, limit + 1);
      prismaMock.musical.findMany.mockResolvedValue(returnedMusicals);

      const caller = createCaller(null);

      const result = await caller.musical.getMusicals({ limit });

      expect(result.musicals).toHaveLength(limit);
      expect(result.nextCursor).toBeDefined();
    });

    it("should include unreleased musicals when includeUnreleased=true and user is logged in", async () => {
      const musicals = [
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo8",
          releaseDate: new Date("2030-01-01"),
        }, // Unreleased
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqo9",
          releaseDate: new Date("2020-01-01"),
        }, // Released
      ];
      prismaMock.musical.findMany.mockResolvedValue(musicals);

      const caller = createCaller({
        user: mockRegularUser,
      });

      const result = await caller.musical.getMusicals({
        includeUnreleased: true,
      });

      expect(result.musicals).toHaveLength(2);
      expect(result.musicals).toEqual(musicals);

      expect(prismaMock.musical.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            releaseDate: expect.any(Object),
          }),
        }),
      );
    });

    it("should throw FORBIDDEN when includeUnreleased=true and user is not logged in", async () => {
      const caller = createCaller(null);

      await expect(
        caller.musical.getMusicals({ includeUnreleased: true }),
      ).rejects.toThrow(TRPCError);
      await expect(
        caller.musical.getMusicals({ includeUnreleased: true }),
      ).rejects.toThrow(
        /Only authenticated users can view unreleased musicals/,
      );
    });

    it("should filter by searchText when provided", async () => {
      const musicals = [
        {
          ...mockMusical,
          id: "cldkw8ym10000jl08o61sbqa1",
          title: "Musical with Test in title",
        },
      ];
      prismaMock.musical.findMany.mockResolvedValue(musicals);

      const caller = createCaller(null);

      const result = await caller.musical.getMusicals({ searchText: "Test" });

      expect(result.musicals).toEqual(musicals);

      expect(prismaMock.musical.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });
});
