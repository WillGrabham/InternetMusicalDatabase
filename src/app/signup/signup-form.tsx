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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useZodForm } from "~/hooks/useZodForm";
import { CreateUserSchema } from "~/types/schemas";

export function SignupForm() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { formData, setValue, getFieldError, validate } =
    useZodForm(CreateUserSchema);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const validData = validate();
    if (!validData) {
      setError("Please fix the validation errors");
      setLoading(false);
      return;
    }

    const { username, password } = validData;

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

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to sign up");
      }

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
        <Header variant="h1" description="Create a new account">
          Sign Up
        </Header>
      }
    >
      <Container>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => router.push("/signin")}>
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

          <FormField
            label="Username"
            controlId="username"
            errorText={getFieldError("username")}
          >
            <Input
              value={formData.username}
              onChange={({ detail }) => setValue("username", detail.value)}
              controlId="username"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Password"
            controlId="password"
            errorText={getFieldError("password")}
          >
            <Input
              value={formData.password}
              onChange={({ detail }) => setValue("password", detail.value)}
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
