"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Form,
  FormField,
  Input,
  ContentLayout,
  Alert,
} from "@cloudscape-design/components";

export function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Validate form
    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to sign up");
      }

      // Success
      setSuccess(true);
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/api/auth/signin");
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
        <Header variant="h1" description="Create a new account">
          Sign Up
        </Header>
      }
    >
      <Container>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => router.push("/api/auth/signin")}
              >
                Already have an account? Sign in
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSubmit()}
                loading={loading}
              >
                Sign Up
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
              Account created successfully! Redirecting to login...
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

          <FormField label="Confirm Password" controlId="confirmPassword">
            <Input
              value={confirmPassword}
              onChange={({ detail }) => setConfirmPassword(detail.value)}
              type="password"
              controlId="confirmPassword"
              disabled={loading}
            />
          </FormField>
        </Form>
      </Container>
    </ContentLayout>
  );
}
