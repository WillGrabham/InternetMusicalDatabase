import { compare } from "bcrypt";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import { type UserRole, UserRoleEnum } from "~/types/schemas";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username as string },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatch) {
          return null;
        }

        const role = UserRoleEnum.safeParse(user.role);
        if (!role.success) {
          console.error("Invalid user role:", user.role);
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.username + "@example.com", // NextAuth requires an email
          role: role.data,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      const role = UserRoleEnum.safeParse(token.role);
      if (!role.success) {
        console.error("Invalid role in token:", token.role);
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            role: UserRoleEnum.enum.USER,
          },
        };
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: role.data,
        },
      };
    },
  },
} satisfies NextAuthConfig;
