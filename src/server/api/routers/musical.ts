import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// Admin-only procedure - extends the protected procedure to check for admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({
    ctx,
  });
});

// Input validation schemas
const musicalInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Valid URL is required"),
  releaseDate: z.date(),
});

const musicalIdSchema = z.object({
  id: z.string().cuid("Invalid musical ID"),
});

export const musicalRouter = createTRPCRouter({
  // Create a new musical (admin only)
  createMusical: adminProcedure
    .input(musicalInputSchema)
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
    .input(z.object({
      id: z.string().cuid("Invalid musical ID"),
      data: musicalInputSchema.partial(),
    }))
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
    .input(musicalIdSchema)
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
    .input(musicalIdSchema)
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
        if (!ctx.session?.user || ctx.session.user.role !== "ADMIN") {
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
    .input(z.object({
      releaseDateFrom: z.date().optional(),
      releaseDateTo: z.date().optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(),
      includeUnreleased: z.boolean().default(false), // Option to include unreleased musicals (admin only)
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;
      const includeUnreleased = input?.includeUnreleased ?? false;
      
      // Check if user wants to see unreleased musicals and has admin privileges
      if (includeUnreleased && (!ctx.session?.user || ctx.session.user.role !== "ADMIN")) {
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
