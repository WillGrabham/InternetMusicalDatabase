import { Suspense } from "react";
import { LoadingState } from "~/app/_components/loading-state";
import { MusicalsPageContent } from "~/app/_components/musicals/musicals-page-content";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";

export const metadata = {
  title: "Musicals | Musical Database",
  description: "Browse and discover musicals",
};

export default async function MusicalsPage() {
  const session = await auth();

  void api.musical.getMusicals.prefetch({
    limit: 10,
    includeUnreleased: !!session?.user,
  });

  return (
    <Suspense fallback={<LoadingState text="Loading musicals..." />}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <HydrateClient>
          <MusicalsPageContent session={session} />
        </HydrateClient>
      </CloudscapeLayout>
    </Suspense>
  );
}
