import { z } from "zod";

// Define strict user roles
export const UserRoleEnum = z.enum(["USER", "ADMIN", "EDITOR"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

// User schema with strict role validation
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

// For creating a new user (without ID)
export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// For user login
export const LoginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// Musical schema with enhanced validation
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

// For creating a musical
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

// For updating a musical (all fields optional)
export const UpdateMusicalSchema = CreateMusicalSchema.partial();
export type UpdateMusicalInput = z.infer<typeof UpdateMusicalSchema>;

// For musical ID validation
export const MusicalIdSchema = z.object({
  id: z.string().cuid("Invalid musical ID"),
});

export type MusicalIdInput = z.infer<typeof MusicalIdSchema>;

// For musical query parameters
export const GetMusicalsSchema = z
  .object({
    releaseDateFrom: z.date().optional(),
    releaseDateTo: z.date().optional(),
    limit: z.number().min(1).max(100).default(50),
    cursor: z.string().nullish(),
    includeUnreleased: z.boolean().default(false),
  })
  .optional();

export type GetMusicalsInput = z.infer<typeof GetMusicalsSchema>;
