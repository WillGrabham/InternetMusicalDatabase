import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Configuration
  const adminUsername = 'admin';
  const adminPassword = 'admin123'; // This would be more secure in a real application
  const saltRounds = 10;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: adminUsername }
    });

    if (existingUser) {
      console.log(`User '${adminUsername}' already exists.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log(`Admin user created successfully:`);
    console.log(`Username: ${user.username}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
