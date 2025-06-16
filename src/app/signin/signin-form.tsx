"use client";

import {
  Alert,
  Button,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SigninForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid username or password");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Sign in to your account">
          Sign In
        </Header>
      }
    >
      <Container>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => router.push("/signup")}>
                Don&apos;t have an account? Sign up
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSubmit()}
                loading={loading}
              >
                Sign In
              </Button>
            </SpaceBetween>
          }
        >
          {error && (
            <Alert type="error" dismissible onDismiss={() => setError("")}>
              {error}
            </Alert>
          )}

          <FormField label="Username" controlId="username">
            <Input
              value={username}
              onChange={({ detail }) => setUsername(detail.value)}
              controlId="username"
              disabled={loading}
            />
          </FormField>

          <FormField label="Password" controlId="password">
            <Input
              value={password}
              onChange={({ detail }) => setPassword(detail.value)}
              type="password"
              controlId="password"
              disabled={loading}
            />
          </FormField>
        </Form>
      </Container>
    </ContentLayout>
  );
}
