import { Suspense } from "react";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { CloudscapeLayout } from "./_components/cloudscape-layout";
import { HomePage } from "./_components/home-page";
import { LoadingState } from "./_components/loading-state";
import { NavigationBar } from "./_components/navigation-bar";

export default async function Home() {
  const session = await auth();

  void api.musical.getMusicals.prefetch({
    limit: 4,
    includeUnreleased: !!session?.user,
  });

  return (
    <>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <Suspense fallback={<LoadingState text="Loading homepage..." />}>
          <HydrateClient>
            <HomePage session={session} />
          </HydrateClient>
        </Suspense>
      </CloudscapeLayout>
    </>
  );
}
