import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  CreateMusicalSchema,
  GetMusicalsSchema,
  MusicalIdSchema,
  UpdateMusicalSchema,
  UserRoleEnum,
} from "~/types/schemas";

// Admin-only procedure - extends the protected procedure to check for admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== UserRoleEnum.enum.ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({
    ctx,
  });
});

export const musicalRouter = createTRPCRouter({
  // Create a new musical (admin only)
  createMusical: adminProcedure
    .input(CreateMusicalSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.musical.create({
        data: {
          ...input,
          createdBy: ctx.session.user.id,
        },
      });
    }),

  // Update an existing musical (admin only)
  updateMusical: adminProcedure
    .input(
      z.object({
        id: z.string().cuid("Invalid musical ID"),
        data: UpdateMusicalSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      // Check if musical exists
      const musical = await ctx.db.musical.findUnique({
        where: { id },
      });

      if (!musical) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musical not found",
        });
      }

      return ctx.db.musical.update({
        where: { id },
        data,
      });
    }),

  // Delete a musical (admin only)
  deleteMusical: adminProcedure
    .input(MusicalIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Check if musical exists
      const musical = await ctx.db.musical.findUnique({
        where: { id },
      });

      if (!musical) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musical not found",
        });
      }

      return ctx.db.musical.delete({
        where: { id },
      });
    }),

  // Get a single musical by ID (public, but unreleased musicals are admin-only)
  getMusical: publicProcedure
    .input(MusicalIdSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const musical = await ctx.db.musical.findUnique({
        where: { id },
      });

      if (!musical) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musical not found",
        });
      }

      // Check if musical is not yet released (release date is in the future)
      const isUnreleased = musical.releaseDate > new Date();

      // If musical is unreleased, only allow admin access
      if (isUnreleased) {
        // Check if user is authenticated and has admin role
        if (
          !ctx.session?.user ||
          ctx.session.user.role !== UserRoleEnum.enum.ADMIN
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This musical has not been released yet",
          });
        }
      }

      return musical;
    }),

  // Get all musicals with optional release date filtering (public, but only released musicals for non-admins)
  getMusicals: publicProcedure
    .input(GetMusicalsSchema)
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;
      const includeUnreleased = input?.includeUnreleased ?? false;

      // Check if user wants to see unreleased musicals and has admin privileges
      if (
        includeUnreleased &&
        (!ctx.session?.user ||
          ctx.session.user.role !== UserRoleEnum.enum.ADMIN)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view unreleased musicals",
        });
      }

      const currentDate = new Date();

      const where = {
        // For non-admins or when not explicitly requesting unreleased musicals,
        // only show musicals with release dates in the past
        ...(!includeUnreleased ? { releaseDate: { lte: currentDate } } : {}),

        // Apply any additional date filters provided by the user
        ...(input?.releaseDateFrom || input?.releaseDateTo
          ? {
              releaseDate: {
                ...(input.releaseDateFrom && { gte: input.releaseDateFrom }),
                ...(input.releaseDateTo && { lte: input.releaseDateTo }),
                // Maintain the "released only" filter for non-admins
                ...(!includeUnreleased ? { lte: currentDate } : {}),
              },
            }
          : {}),
      };

      const musicals = await ctx.db.musical.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { releaseDate: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (musicals.length > limit) {
        const nextItem = musicals.pop();
        nextCursor = nextItem!.id;
      }

      return {
        musicals,
        nextCursor,
      };
    }),
});
