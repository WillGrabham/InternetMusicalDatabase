"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Form,
  ContentLayout,
  Alert,
} from "@cloudscape-design/components";

export function SignoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      setSuccess(true);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Sign out of your account">
          Sign Out
        </Header>
      }
    >
      <Container>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => router.push("/")}
              >
                Return to home page
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSignOut()}
                loading={loading}
              >
                Sign Out
              </Button>
            </SpaceBetween>
          }
        >
          {error && (
            <Alert type="error" dismissible onDismiss={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert type="success" dismissible onDismiss={() => setSuccess(false)}>
              You have been signed out successfully! Redirecting to home page...
            </Alert>
          )}

          <Alert type="info">
            Click the Sign Out button to sign out of your account.
          </Alert>
        </Form>
      </Container>
    </ContentLayout>
  );
}
