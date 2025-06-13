"use client";

import Image from "next/image";
import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  ColumnLayout,
  Alert,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";

interface MusicalDetailsContentProps {
  musical: Musical;
  isUnreleased: boolean;
  isAdmin?: boolean;
}

export function MusicalDetailsContent({ musical, isUnreleased, isAdmin }: MusicalDetailsContentProps) {
  const releaseDate = new Date(musical.releaseDate).toLocaleDateString();
  
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description={`Released: ${releaseDate}`}
            actions={
              <Button variant="primary" href="/musicals">
                Back to Musicals
              </Button>
            }
          >
            {musical.title}
          </Header>
          
          {isUnreleased && (
            <Alert type="warning">
              This musical has not been released yet. {isAdmin ? "You can see it because you are an administrator." : "It is only visible to administrators."}
            </Alert>
          )}
        </SpaceBetween>
      }
    >
      <Container>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <div style={{ position: "relative", width: "100%", height: "400px" }}>
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
