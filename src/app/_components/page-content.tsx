"use client";

import type { CardsProps } from "@cloudscape-design/components";
import {
  Container,
  Header,
  Cards,
  Box,
  SpaceBetween,
  Button,
  ContentLayout,
  Link,
  Alert,
} from "@cloudscape-design/components";
import { LatestPost } from "./post";
import type { Session } from "next-auth";

interface PageContentProps {
  hello: { greeting: string };
  session: Session | null;
}

export function PageContent({ hello, session }: PageContentProps) {
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description={
              `Welcome to T3 App - A Modern Full-Stack Framework`
            }
            info={<Link variant="info">Learn more</Link>}
            actions={
              <Button variant="primary" href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                {session ? "Sign out" : "Sign in"}
              </Button>
            }
          >
            Create T3 App
          </Header>

          {session && (
            <Alert>
              Welcome back, <Box color="text-label">{session?.user?.name}</Box>!
            </Alert>
          )}
        </SpaceBetween>
      }
    >
      <Container>

        <Cards
          ariaLabels={{
            itemSelectionLabel: (_e: unknown, n: { name: string }) => `Select ${n.name}`,
            selectionGroupLabel: "Card selection"
          }}
          cardDefinition={{
            header: (item) => (
              <Link href={item.href} fontSize="heading-m">
                {item.name}
              </Link>
            ),
            sections: [
              {
                id: "description",
                content: (item) => (
                  <Box color="text-body-secondary">
                    {item.description}
                  </Box>
                )
              }
            ]
          } as CardsProps.CardDefinition<{ name: string; description: string; href: string }>}
          items={[
            {
              name: "First Steps →",
              description: "Just the basics - Everything you need to know to set up your database and authentication.",
              href: "https://create.t3.gg/en/usage/first-steps"
            },
            {
              name: "Documentation →",
              description: "Learn more about Create T3 App, the libraries it uses, and how to deploy it.",
              href: "https://create.t3.gg/en/introduction"
            }
          ]}
          trackBy="name"
          empty={
            <Box textAlign="center" color="text-body-secondary">
              <b>No resources available</b>
              <Box padding={{ top: "xs" }}>
                No resources to display
              </Box>
            </Box>
          }
        />

        <Container
          header={
            <Header
              variant="h2"
              description="Real-time tRPC Query Status"
            >
              API Status
            </Header>
          }
        >
          <Box color="text-status-success" fontSize="heading-s">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </Box>
        </Container>

        {session?.user && <LatestPost />}
      </Container>
    </ContentLayout>
  );
}
