"use client";

import {
  Button,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { MusicalList } from "./musical-list";

interface MusicalsPageContentProps {
  session?: Session | null;
}

export function MusicalsPageContent({
  session,
}: MusicalsPageContentProps = {}) {
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Browse our collection of musicals"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                {isAdmin && (
                  <Button
                    onClick={() => router.push("/musicals/create")}
                    variant="primary"
                  >
                    Create Musical
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/")}
                  variant={isAdmin ? "normal" : "primary"}
                >
                  Back to home
                </Button>
              </SpaceBetween>
            }
          >
            Musicals
          </Header>
        </SpaceBetween>
      }
    >
      <Suspense fallback={<div>Loading musicals...</div>}>
        <MusicalList session={session} />
      </Suspense>
    </ContentLayout>
  );
}
