"use client";

import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MusicalDetailsContentProps {
  musical: Musical;
  isUnreleased: boolean;
  isAdmin?: boolean;
}

export function MusicalDetailsContent({
  musical,
  isUnreleased,
  isAdmin,
}: MusicalDetailsContentProps) {
  const router = useRouter();
  const releaseDate = new Date(musical.releaseDate).toLocaleDateString();

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description={`Released: ${releaseDate}`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                {isAdmin && (
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/musicals/${musical.id}/edit`)}
                  >
                    Edit Musical
                  </Button>
                )}
                <Button
                  variant={isAdmin ? "normal" : "primary"}
                  href="/musicals"
                >
                  Back to Musicals
                </Button>
              </SpaceBetween>
            }
          >
            {musical.title}
          </Header>

          {isUnreleased && (
            <Alert type="warning">
              This musical has not been released yet.{" "}
              {isAdmin
                ? "You can see it because you are an administrator."
                : "It is only visible to administrators."}
            </Alert>
          )}
        </SpaceBetween>
      }
    >
      <Container>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Image
                src={musical.posterUrl}
                alt={`${musical.title} poster`}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          <SpaceBetween size="l">
            <Box variant="h2">Description</Box>
            <Box variant="p">{musical.description}</Box>

            <Box variant="h3">Details</Box>
            <Box>
              <Box variant="awsui-key-label">Release Date</Box>
              <Box variant="p">{releaseDate}</Box>
            </Box>
          </SpaceBetween>
        </ColumnLayout>
      </Container>
    </ContentLayout>
  );
}
