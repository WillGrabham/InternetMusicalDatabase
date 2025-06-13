"use client";

import { Suspense } from "react";
import type { Session } from "next-auth";
import { MusicalList } from "./musical-list";
import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
} from "@cloudscape-design/components";
import { useRouter } from "next/navigation";

interface MusicalsPageContentProps {
  session?: Session | null;
}

export function MusicalsPageContent({ session }: MusicalsPageContentProps = {}) {
  const router = useRouter();
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Browse our collection of musicals"
            actions={
                <Button onClick={() => router.push('/')} variant="primary">Back to home</Button>
            }
          >
            Musicals
          </Header>
        </SpaceBetween>
      }
    >
      <Container>
        <Suspense fallback={<div>Loading musicals...</div>}>
          <MusicalList session={session} />
        </Suspense>
      </Container>
    </ContentLayout>
  );
}
