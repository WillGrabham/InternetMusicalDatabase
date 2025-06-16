import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <SignupForm />
      </CloudscapeLayout>
    </Suspense>
  );
}
