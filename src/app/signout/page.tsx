import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";
import { SignoutForm } from "./signout-form";

export default async function SignoutPage() {
  // Check if user is logged in
  const session = await auth();

  // If user is not logged in, redirect to sign-in page
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
