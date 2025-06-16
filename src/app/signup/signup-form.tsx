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
import { useZodForm } from "~/hooks/useZodForm";
import { api } from "~/trpc/react";
import { CreateUserSchema } from "~/types/schemas";

export function SignupForm() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { formData, setValue, getFieldError, validate } =
    useZodForm(CreateUserSchema);

  const signup = api.user.signup.useMutation({
    onSuccess: async (data) => {
      const result = await signIn("credentials", {
        username: data.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but failed to sign in automatically");
        setLoading(false);
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

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

    signup.mutate({ username, password });
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
