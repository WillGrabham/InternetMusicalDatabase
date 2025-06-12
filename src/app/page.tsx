import { Suspense } from "react";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { PageContent } from "./_components/page-content";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent hello={hello} session={session} />
    </Suspense>
  );
}
