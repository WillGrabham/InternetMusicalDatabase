"use client";

import {
  Alert,
  Box,
  Button,
  SpaceBetween,
} from "@cloudscape-design/components";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "An error occurred",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Box padding="l">
      <Alert
        type="error"
        header={title}
        action={
          onRetry ? (
            <Button onClick={onRetry} variant="primary">
              Retry
            </Button>
          ) : undefined
        }
      >
        <SpaceBetween size="m">
          <div>{message}</div>
        </SpaceBetween>
      </Alert>
    </Box>
  );
}
