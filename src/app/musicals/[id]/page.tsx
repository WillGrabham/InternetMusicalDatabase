import { type Metadata } from "next";
import { type Session } from "next-auth";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { CloudscapeLayout } from "~/app/_components/cloudscape-layout";
import { ErrorState } from "~/app/_components/error-state";
import { LoadingState } from "~/app/_components/loading-state";
import { MusicalDetailsContent } from "~/app/_components/musicals/musical-details-content";
import { NavigationBar } from "~/app/_components/navigation-bar";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

// Cache the musical data fetch to avoid duplicate API calls
const getMusical = cache(async (id: string) => {
  try {
    return await api.musical.getMusical({ id });
  } catch (error) {
    console.error("Error fetching musical:", error);
    return null;
  }
});

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: {
  params: Params;
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

export default async function MusicalPage(props: { params: Params }) {
  const params = await props.params;
  const session = await auth();

  return (
    <Suspense fallback={<LoadingState text="Loading musical details..." />}>
      <MusicalPageContent id={params.id} session={session} />
    </Suspense>
  );
}

async function MusicalPageContent({
  id,
  session,
}: {
  id: string;
  session: Session | null;
}) {
  try {
    const musical = await getMusical(id);

    if (!musical) {
      notFound();
    }

    const isUnreleased = new Date(musical.releaseDate) > new Date();
    const isAdmin = session?.user?.role === "ADMIN";

    return (
      <>
        <NavigationBar session={session} />
        <CloudscapeLayout>
          <MusicalDetailsContent
            musical={musical}
            isUnreleased={isUnreleased}
            isAdmin={isAdmin}
          />
        </CloudscapeLayout>
      </>
    );
  } catch (error) {
    console.error("Error in MusicalPageContent:", error);
    return (
      <ErrorState
        title="Failed to load musical"
        message="There was an error loading this musical. Please try again later."
      />
    );
  }
}
