import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignoutForm } from "./signout-form";
import { auth } from "~/server/auth";

export default async function SignoutPage() {
  // Check if user is logged in
  const session = await auth();
  
  // If user is not logged in, redirect to sign-in page
  if (!session) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignoutForm />
    </Suspense>
  );
}
