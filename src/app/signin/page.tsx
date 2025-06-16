import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/server/auth";
import { CloudscapeLayout } from "../_components/cloudscape-layout";
import { NavigationBar } from "../_components/navigation-bar";
import { SigninForm } from "./signin-form";

export default async function SigninPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationBar session={session} />
      <CloudscapeLayout>
        <SigninForm />
      </CloudscapeLayout>
    </Suspense>
  );
}
