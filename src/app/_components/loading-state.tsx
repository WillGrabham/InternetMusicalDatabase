"use client";

import { Box, Spinner } from "@cloudscape-design/components";

interface LoadingStateProps {
  text?: string;
  centered?: boolean;
}

export function LoadingState({
  text = "Loading...",
  centered = true,
}: LoadingStateProps) {
  return (
    <Box
      padding="l"
      textAlign={centered ? "center" : "left"}
      color="text-status-info"
    >
      <Spinner size={"normal"} />
      <Box padding={{ top: "s" }}>{text}</Box>
    </Box>
  );
}
