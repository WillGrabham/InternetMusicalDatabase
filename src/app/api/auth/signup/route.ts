import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { CreateUserSchema, UserRoleEnum } from "~/types/schemas";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const result = CreateUserSchema.safeParse({
      ...body,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { username, password } = result.data;

    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 },
      );
    }

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        role: UserRoleEnum.Enum.USER,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
