"use client";

import {
  Alert,
  Badge,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Session } from "next-auth";
import { HomeMusicalList } from "./musicals/home-musical-list";

interface HomePageProps {
  session: Session | null;
}

export function HomePage({ session }: HomePageProps) {
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          {session && (
            <Alert>
              {" "}
              {session.user.role === "ADMIN" && (
                <Badge color="red">Admin</Badge>
              )}{" "}
              Welcome back, {session?.user?.name}!
            </Alert>
          )}
          <Header variant="h1" description="Browse and discover musicals">
            Musical Database
          </Header>
        </SpaceBetween>
      }
    >
      <HomeMusicalList session={session} />
    </ContentLayout>
  );
}
