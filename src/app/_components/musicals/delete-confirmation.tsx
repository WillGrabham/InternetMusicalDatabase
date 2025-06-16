"use client";

import {
  Alert,
  Box,
  Button,
  Modal,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";
import { useState } from "react";
import { api } from "~/trpc/react";

interface DeleteConfirmationProps {
  musical: Musical;
  onDismiss: () => void;
  onDelete: () => void;
}

export function DeleteConfirmation({
  musical,
  onDismiss,
  onDelete,
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMutation = api.musical.deleteMusical.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      onDelete();
    },
    onError: (err) => {
      setIsDeleting(false);
      setError(err.message || "Failed to delete musical. Please try again.");
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    setError(null);
    deleteMutation.mutate({ id: musical.id });
  };

  return (
    <Modal
      visible={true}
      onDismiss={onDismiss}
      header="Delete Musical"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        {error && (
          <Alert type="error" header="Error deleting musical">
            {error}
          </Alert>
        )}

        <Box variant="p">
          Are you sure you want to delete <strong>{musical.title}</strong>? This
          action cannot be undone.
        </Box>
      </SpaceBetween>
    </Modal>
  );
}
