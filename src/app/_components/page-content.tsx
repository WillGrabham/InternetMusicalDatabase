"use client";

import {
  Container,
  Header,
  SpaceBetween,
  Button,
  ContentLayout,
  Alert,
} from "@cloudscape-design/components";
import { LatestPost } from "./post";
import type { Session } from "next-auth";

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
            description="Browse and discover films"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                {!session && (
                  <Button variant="normal" href="/signup">
                    Sign up
                  </Button>
                )}
                <Button variant="primary" href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  {session ? "Sign out" : "Sign in"}
                </Button>
              </SpaceBetween>
            }
          >
            Film Database
          </Header>

          {session && (
            <Alert>
              Welcome back, {session?.user?.name}!
            </Alert>
          )}
        </SpaceBetween>
      }
    >
      <Container>
        {session?.user && <LatestPost />}
      </Container>
    </ContentLayout>
  );
}
