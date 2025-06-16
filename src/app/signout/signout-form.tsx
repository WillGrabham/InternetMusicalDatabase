"use client";

import {
  Alert,
  Button,
  Container,
  ContentLayout,
  Form,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
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
              <Button variant="link" onClick={() => router.push("/")}>
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

          <Alert type="info">
            Click the Sign Out button to sign out of your account.
          </Alert>
        </Form>
      </Container>
    </ContentLayout>
  );
}
