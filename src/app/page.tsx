import { Suspense } from "react";
import { auth } from "~/server/auth";
import { PageContent } from "./_components/page-content";

export default async function Home() {
  const session = await auth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent session={session} />
    </Suspense>
  );
}
