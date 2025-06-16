import { Suspense } from "react";
import { LoadingState } from "~/app/_components/loading-state";
import { MusicalsPageContent } from "~/app/_components/musicals/musicals-page-content";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";

export const metadata = {
  title: "Musicals | Musical Database",
  description: "Browse and discover musicals",
};

export default async function MusicalsPage() {
  const session = await auth();

  return (
    <Suspense fallback={<LoadingState text="Loading musicals..." />}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <MusicalsPageContent session={session} />
      </CloudscapeLayout>
    </Suspense>
  );
}
