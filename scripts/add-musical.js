import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Delete musicals
        await prisma.musical.deleteMany({});
        console.log(`Deleted all musicals`);

        // Create a sample musical
        const musical = await prisma.musical.create({
            data: {
                title: "Hamilton",
                description: "Hamilton is a musical with music, lyrics, and book by Lin-Manuel Miranda. It tells the story of American Founding Father Alexander Hamilton through music that draws heavily from hip hop, as well as R&B, pop, soul, and traditional-style show tunes.",
                posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/83/Hamilton-poster.jpg",
                releaseDate: new Date("2015-08-06"),
                createdBy: "system", // Since we don't have a real user ID
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(`Created musical with ID: ${musical.id}`);

        // Create another sample musical
        const musical2 = await prisma.musical.create({
            data: {
                title: "The Phantom of the Opera",
                description: "The Phantom of the Opera is a musical with music by Andrew Lloyd Webber and lyrics by Charles Hart. It tells the story of a beautiful soprano, Christine Daaé, who becomes the obsession of a mysterious, disfigured musical genius living in the subterranean labyrinth beneath the Paris Opéra House.",
                posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/ef/The_Phantom_of_the_Opera_%281986_musical%29.jpg",
                releaseDate: new Date("1986-10-09"),
                createdBy: "system", // Since we don't have a real user ID
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(`Created musical with ID: ${musical2.id}`);

        // Create a future musical (unreleased)
        const musical3 = await prisma.musical.create({
            data: {
                title: "Future Broadway Hit",
                description: "This is an upcoming musical that hasn't been released yet. It will feature amazing songs and performances.",
                posterUrl: "https://placehold.co/400x600/png?text=Coming+Soon",
                releaseDate: new Date("2026-01-01"), // Future date
                createdBy: "system", // Since we don't have a real user ID
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(`Created musical with ID: ${musical3.id}`);

        console.log("Sample musicals added successfully!");
    } catch (error) {
        console.error("Error adding sample musicals:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
