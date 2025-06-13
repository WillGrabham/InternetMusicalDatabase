import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/server/auth";
import { SigninForm } from "./signin-form";

export default async function SigninPage() {
  // Check if user is already logged in
  const session = await auth();

  // If user is logged in, redirect to home page
  if (session) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninForm />
    </Suspense>
  );
}
