import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { username?: string; password?: string };
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // Create the user
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Return the user without the password
    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
