import { notFound } from "next/navigation";
import { cache } from "react";
import { CloudscapeLayout } from "~/app/_components/cloudscape-layout";
import { MusicalForm } from "~/app/_components/musicals/musical-form";
import { NavigationBar } from "~/app/_components/navigation-bar";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

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

export default async function EditMusicalPage({ params }: { params: Params }) {
  const session = await auth();
  const resolvedParams = await params;

  if (session?.user?.role !== "ADMIN") {
    return notFound();
  }

  const musical = await getMusical(resolvedParams.id);

  if (!musical) {
    notFound();
  }

  return (
    <>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <MusicalForm musical={musical} isEdit={true} />
      </CloudscapeLayout>
    </>
  );
}
