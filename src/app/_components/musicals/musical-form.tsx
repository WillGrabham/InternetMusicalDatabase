"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
  Textarea,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useZodForm } from "~/hooks/useZodForm";
import { api } from "~/trpc/react";
import { CreateMusicalSchema } from "~/types/schemas";
import { DeleteConfirmation } from "./delete-confirmation";

// Import DatePicker as a client-only component to avoid hydration mismatch
const DatePicker = dynamic(
  () => import("@cloudscape-design/components").then((mod) => mod.DatePicker),
  { ssr: false },
);

interface MusicalFormProps {
  musical?: Musical;
  isEdit?: boolean;
}

export function MusicalForm({ musical, isEdit = false }: MusicalFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const initialData = useMemo(() => {
    return musical
      ? {
          title: musical.title,
          description: musical.description,
          posterUrl: musical.posterUrl,
          releaseDate: musical.releaseDate,
        }
      : {};
  }, [musical]);

  const { formData, setValue, getFieldError, validate, isValid } = useZodForm(
    CreateMusicalSchema,
    initialData,
  );

  const [releaseDateString, setReleaseDateString] = useState<string>(
    musical?.releaseDate
      ? (new Date(musical.releaseDate).toISOString().split("T")[0] ?? "")
      : "",
  );

  useEffect(() => {
    if (releaseDateString) {
      setValue("releaseDate", new Date(releaseDateString));
    }
  }, [releaseDateString]);

  const createMutation = api.musical.createMusical.useMutation({
    onSuccess: () => {
      router.push("/musicals");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const updateMutation = api.musical.updateMusical.useMutation({
    onSuccess: () => {
      router.push(`/musicals/${musical?.id}`);
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const deleteMutation = api.musical.deleteMusical.useMutation({
    onSuccess: () => {
      router.push("/musicals");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    const validData = validate();
    if (!validData) {
      setError("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && musical) {
        updateMutation.mutate({
          id: musical.id,
          data: validData,
        });
      } else {
        createMutation.mutate(validData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteDismiss = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = () => {
    router.push("/musicals");
    router.refresh();
  };

  return (
    <Container>
      <Form
        header={
          <Header variant="h1">
            {isEdit ? "Edit Musical" : "Create Musical"}
          </Header>
        }
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={() =>
                router.push(
                  isEdit && musical ? `/musicals/${musical.id}` : "/musicals",
                )
              }
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              loading={isSubmitting && !deleteMutation.isPending}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          {error && (
            <Alert type="error" header="Error">
              <SpaceBetween size="s">
                <div>{error}</div>
                {isSubmitting && (
                  <Box textAlign="center">
                    <Button onClick={() => setError(null)}>Dismiss</Button>
                  </Box>
                )}
              </SpaceBetween>
            </Alert>
          )}

          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <Alert
              type="success"
              header={isEdit ? "Musical Updated" : "Musical Created"}
            >
              {isEdit
                ? "The musical was successfully updated."
                : "The musical was successfully created."}
            </Alert>
          )}

          <FormField label="Title" errorText={getFieldError("title")}>
            <Input
              value={formData.title}
              onChange={({ detail }) => setValue("title", detail.value)}
              placeholder="Enter musical title"
            />
          </FormField>

          <FormField
            label="Description"
            errorText={getFieldError("description")}
          >
            <Textarea
              value={formData.description}
              onChange={({ detail }) => setValue("description", detail.value)}
              placeholder="Enter musical description"
              rows={5}
            />
          </FormField>

          <FormField label="Poster URL" errorText={getFieldError("posterUrl")}>
            <Input
              value={formData.posterUrl}
              onChange={({ detail }) => setValue("posterUrl", detail.value)}
              placeholder="https://example.com/poster.jpg"
              type="url"
            />
          </FormField>

          <FormField
            label="Release Date"
            errorText={getFieldError("releaseDate")}
          >
            <DatePicker
              value={releaseDateString}
              onChange={({ detail }) => setReleaseDateString(detail.value)}
              placeholder="YYYY-MM-DD"
            />
          </FormField>

          {isEdit && (
            <Box textAlign="right">
              <Button variant="normal" onClick={handleDeleteClick}>
                Delete Musical
              </Button>
            </Box>
          )}

          {isEdit && musical && showDeleteConfirmation && (
            <DeleteConfirmation
              musical={musical}
              onDismiss={handleDeleteDismiss}
              onDelete={handleDeleteConfirm}
            />
          )}
        </SpaceBetween>
      </Form>
    </Container>
  );
}
