import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Configuration
  const username = 'user';
  const password = 'user123'; // This would be more secure in a real application
  const saltRounds = 10;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log(`User '${username}' already exists.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the regular user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log(`Regular user created successfully:`);
    console.log(`Username: ${user.username}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
