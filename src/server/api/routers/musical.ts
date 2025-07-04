import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import {
  CreateMusicalSchema,
  GetMusicalsSchema,
  MusicalIdSchema,
  UpdateMusicalSchema,
} from "~/types/schemas";

export const musicalRouter = createTRPCRouter({
  // Create a new musical (admin only)
  createMusical: adminProcedure
    .input(CreateMusicalSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(
        `user: \`${ctx.session.user.id}\` is creating musical: ${input.title}`,
      );
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

      const musical = await ctx.db.musical.findUnique({
        where: { id },
      });

      if (!musical) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musical not found",
        });
      }

      console.log(
        `user: \`${ctx.session.user.id}\` is updating musical: ${musical.title}`,
      );
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

      const musical = await ctx.db.musical.findUnique({
        where: { id },
      });

      if (!musical) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musical not found",
        });
      }

      console.log(
        `user: \`${ctx.session.user.id}\` is deleting musical: ${musical.title}`,
      );
      return ctx.db.musical.delete({
        where: { id },
      });
    }),

  // Get a single musical by ID (public, but unreleased musicals require authentication)
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

      const isUnreleased = musical.releaseDate > new Date();

      if (isUnreleased && !ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This musical has not been released yet",
        });
      }

      return musical;
    }),

  // Get all musicals (public, but unreleased musicals require authentication)
  getMusicals: publicProcedure
    .input(GetMusicalsSchema)
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;
      const includeUnreleased = input?.includeUnreleased ?? false;
      const searchText = input?.searchText;

      if (includeUnreleased && !ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only authenticated users can view unreleased musicals",
        });
      }

      const currentDate = new Date();

      const where = {
        ...(!includeUnreleased ? { releaseDate: { lte: currentDate } } : {}),
        ...(searchText
          ? {
              OR: [
                { title: { contains: searchText } },
                { description: { contains: searchText } },
              ],
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
