"use client";

import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ErrorState } from "../error-state";
import { LoadingState } from "../loading-state";
import { MusicalCards } from "./musical-cards";

interface HomeMusicalListProps {
  session: Session | null;
}

export function HomeMusicalList({ session }: HomeMusicalListProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const { data, isLoading, error, refetch } = api.musical.getMusicals.useQuery({
    limit: 4,
    includeUnreleased: !!session?.user,
  });

  const musicals = data?.musicals ?? [];

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  return (
    <Container>
      <SpaceBetween size="l">
        <Header
          variant="h2"
          actions={
            <Button onClick={() => router.push("/musicals")} variant="primary">
              View All
            </Button>
          }
        >
          Latest Musicals
        </Header>

        {isLoading || isRetrying ? (
          <LoadingState text="Loading latest musicals..." />
        ) : error ? (
          <ErrorState
            title="Failed to load musicals"
            message={error.message}
            onRetry={handleRetry}
          />
        ) : musicals.length === 0 ? (
          <Box textAlign="center">
            <b>No musicals found</b>
            <Box padding={{ bottom: "s" }} variant="p">
              Check back later for new releases.
            </Box>
          </Box>
        ) : (
          <MusicalCards musicals={musicals} />
        )}
      </SpaceBetween>
    </Container>
  );
}
