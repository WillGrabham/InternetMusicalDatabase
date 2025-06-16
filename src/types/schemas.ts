import { z } from "zod";

export const UserRoleEnum = z.enum(["USER", "ADMIN", "EDITOR"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserSchema = z.object({
  id: z.string().cuid(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRoleEnum,
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true, role: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export const MusicalSchema = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  posterUrl: z.string().url("Valid URL is required"),
  releaseDate: z.date(),
  createdBy: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Musical = z.infer<typeof MusicalSchema>;

export const CreateMusicalSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  posterUrl: z.string().url("Valid URL is required"),
  releaseDate: z.date(),
});

export type CreateMusicalInput = z.infer<typeof CreateMusicalSchema>;

export const UpdateMusicalSchema = CreateMusicalSchema.partial();
export type UpdateMusicalInput = z.infer<typeof UpdateMusicalSchema>;

export const MusicalIdSchema = z.object({
  id: z.string().cuid("Invalid musical ID"),
});

export type MusicalIdInput = z.infer<typeof MusicalIdSchema>;

export const GetMusicalsSchema = z
  .object({
    limit: z.number().min(1).max(100).default(50),
    cursor: z.string().nullish(),
    includeUnreleased: z.boolean().default(false),
  })
  .optional();

export type GetMusicalsInput = z.infer<typeof GetMusicalsSchema>;
