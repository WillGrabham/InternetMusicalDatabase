import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { cache } from "react";
import { type Metadata } from "next";
import { MusicalDetailsContent } from "~/app/_components/musicals/musical-details-content";

export const dynamic = "force-dynamic";

// Cache the musical data fetch to avoid duplicate API calls
const getMusical = cache(async (id: string) => {
  try {
    return await api.musical.getMusical({ id });
  } catch {
    return null;
  }
});

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: { 
  params: Params 
}): Promise<Metadata> {
  const params = await props.params;
  const musical = await getMusical(params.id);
  
  if (!musical) {
    return {
      title: "Musical Not Found | Musical Database",
      description: "The requested musical could not be found.",
    };
  }
  
  return {
    title: `${musical.title} | Musical Database`,
    description: musical.description,
  };
}

export default async function MusicalPage(props: { 
  params: Params 
}) {
  const params = await props.params;
  const session = await auth();
  const musical = await getMusical(params.id);
  
  if (!musical) {
    notFound();
  }
  
  const isUnreleased = new Date(musical.releaseDate) > new Date();
  const isAdmin = session?.user?.role === "ADMIN";
  
  return <MusicalDetailsContent 
    musical={musical} 
    isUnreleased={isUnreleased} 
    isAdmin={isAdmin}
  />;
}
