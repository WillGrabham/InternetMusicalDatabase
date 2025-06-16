import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";
import { SignoutForm } from "./signout-form";

export default async function SignoutPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <SignoutForm />
      </CloudscapeLayout>
    </Suspense>
  );
}
