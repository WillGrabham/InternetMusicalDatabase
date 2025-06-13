import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignupForm } from "./signup-form";
import { auth } from "~/server/auth";

export default async function SignupPage() {
  // Check if user is already logged in
  const session = await auth();
  
  // If user is logged in, redirect to home page
  if (session) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
