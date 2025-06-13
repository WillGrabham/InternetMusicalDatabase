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
import { api } from "~/trpc/react";
import { MusicalCards } from "./musical-cards";

interface HomeMusicalListProps {
  session: Session | null;
}

export function HomeMusicalList({ session }: HomeMusicalListProps) {
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data, isLoading, error } = api.musical.getMusicals.useQuery({
    limit: 4,
    includeUnreleased: isAdmin,
  });

  const musicals = data?.musicals ?? [];

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

        {isLoading ? (
          <Box>Loading musicals...</Box>
        ) : error ? (
          <Box color="text-status-error">
            Error loading musicals: {error.message}
          </Box>
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
