import { PrismaClient } from "@prisma/client";
import { beforeEach, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("~/server/db", () => ({
  db: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
  vi.clearAllMocks();
});
