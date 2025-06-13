import { Suspense } from "react";
import { SignoutForm } from "./signout-form";

export default function SignoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignoutForm />
    </Suspense>
  );
}
