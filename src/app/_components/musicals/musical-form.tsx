"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  DatePicker,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
  Textarea,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { DeleteConfirmation } from "./delete-confirmation";

interface MusicalFormProps {
  musical?: Musical;
  isEdit?: boolean;
}

export function MusicalForm({ musical, isEdit = false }: MusicalFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(musical?.title ?? "");
  const [description, setDescription] = useState(musical?.description ?? "");
  const [posterUrl, setPosterUrl] = useState(musical?.posterUrl ?? "");
  const [releaseDate, setReleaseDate] = useState<string>(
    musical?.releaseDate
      ? (new Date(musical.releaseDate).toISOString().split("T")[0] ?? "")
      : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // tRPC mutations
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

  // Form validation
  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    posterUrl.trim() !== "" &&
    releaseDate !== "";

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = {
      title,
      description,
      posterUrl,
      releaseDate: new Date(releaseDate || new Date().toISOString()),
    };

    if (isEdit && musical) {
      updateMutation.mutate({
        id: musical.id,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle showing delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  // Handle delete confirmation dismiss
  const handleDeleteDismiss = () => {
    setShowDeleteConfirmation(false);
  };

  // Handle musical deletion after confirmation
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
              disabled={!isFormValid || isSubmitting}
              loading={isSubmitting && !deleteMutation.isPending}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          {error && <Alert type="error">{error}</Alert>}

          <FormField label="Title" constraintText="Required">
            <Input
              value={title}
              onChange={({ detail }) => setTitle(detail.value)}
              placeholder="Enter musical title"
            />
          </FormField>

          <FormField label="Description" constraintText="Required">
            <Textarea
              value={description}
              onChange={({ detail }) => setDescription(detail.value)}
              placeholder="Enter musical description"
              rows={5}
            />
          </FormField>

          <FormField
            label="Poster URL"
            constraintText="Required, must be a valid URL"
          >
            <Input
              value={posterUrl}
              onChange={({ detail }) => setPosterUrl(detail.value)}
              placeholder="https://example.com/poster.jpg"
              type="url"
            />
          </FormField>

          <FormField label="Release Date" constraintText="Required">
            <DatePicker
              value={releaseDate}
              onChange={({ detail }) => setReleaseDate(detail.value)}
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
