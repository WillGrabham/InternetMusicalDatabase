"use client";

import {
  Alert,
  Button,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Session } from "next-auth";
import { HomeMusicalList } from "./musicals/home-musical-list";

interface PageContentProps {
  session: Session | null;
}

export function PageContent({ session }: PageContentProps) {
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Browse and discover musicals"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                {!session && (
                  <Button variant="normal" href="/signup">
                    Sign up
                  </Button>
                )}
                <Button
                  variant="primary"
                  href={session ? "/signout" : "/signin"}
                >
                  {session ? "Sign out" : "Sign in"}
                </Button>
              </SpaceBetween>
            }
          >
            Musical Database
          </Header>

          {session && <Alert>Welcome back, {session?.user?.name}!</Alert>}
        </SpaceBetween>
      }
    >
      <Container>
        <HomeMusicalList session={session} />
      </Container>
    </ContentLayout>
  );
}
