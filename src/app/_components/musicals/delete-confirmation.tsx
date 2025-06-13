"use client";

import {
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
  const deleteMutation = api.musical.deleteMusical.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      onDelete();
    },
    onError: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
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
      <Box variant="p">
        Are you sure you want to delete <strong>{musical.title}</strong>? This
        action cannot be undone.
      </Box>
    </Modal>
  );
}
