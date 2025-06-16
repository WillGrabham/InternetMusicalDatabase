import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { CreateUserSchema, UserRoleEnum } from "~/types/schemas";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const user = await ctx.db.user.create({
        data: {
          username,
          password: hashedPassword,
          role: UserRoleEnum.Enum.USER,
        },
      });

      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }),
});
