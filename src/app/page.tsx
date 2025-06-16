import { Suspense } from "react";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "./_components/cloudscape-layout";
import { LoadingState } from "./_components/loading-state";
import { NavigationBar } from "./_components/navigation-bar";
import { PageContent } from "./_components/page-content";

export default async function Home() {
  const session = await auth();

  return (
    <Suspense fallback={<LoadingState text="Loading homepage..." />}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <PageContent session={session} />
      </CloudscapeLayout>
    </Suspense>
  );
}
