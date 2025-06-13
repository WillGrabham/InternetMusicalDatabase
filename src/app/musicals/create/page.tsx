import { notFound } from "next/navigation";
import { MusicalForm } from "~/app/_components/musicals/musical-form";
import { auth } from "~/server/auth";

export const dynamic = "force-dynamic";

export default async function CreateMusicalPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return notFound();
  }

  return <MusicalForm isEdit={false} />;
}
