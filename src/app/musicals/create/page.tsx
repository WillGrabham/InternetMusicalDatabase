import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CloudscapeLayout } from "~/app/_components/cloudscape-layout";
import { MusicalForm } from "~/app/_components/musicals/musical-form";
import { NavigationBar } from "~/app/_components/navigation-bar";
import { auth } from "~/server/auth";

export const dynamic = "force-dynamic";

export default async function CreateMusicalPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return notFound();
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <MusicalForm isEdit={false} />
      </CloudscapeLayout>
    </Suspense>
  );
}
