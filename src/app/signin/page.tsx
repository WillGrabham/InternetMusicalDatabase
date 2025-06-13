import { Suspense } from "react";
import { SigninForm } from "./signin-form";

export default function SigninPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninForm />
    </Suspense>
  );
}
