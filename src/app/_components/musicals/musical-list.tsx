"use client";

import {
  Box,
  Container,
  Header,
  Pagination,
  SpaceBetween,
  TextFilter,
} from "@cloudscape-design/components";
import type { Session } from "next-auth";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ErrorState } from "../error-state";
import { LoadingState } from "../loading-state";
import { MusicalCards } from "./musical-cards";

interface MusicalListProps {
  session?: Session | null;
}

export function MusicalList({ session }: MusicalListProps = {}) {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = api.musical.getMusicals.useQuery({
    limit: itemsPerPage,
    cursor: cursor ?? undefined,
    includeUnreleased: !!session?.user,
  });

  const filteredMusicals =
    data?.musicals.filter(
      (musical) =>
        musical.title.toLowerCase().includes(filterText.toLowerCase()) ||
        musical.description.toLowerCase().includes(filterText.toLowerCase()),
    ) ?? [];

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  const handlePaginationChange = (event: {
    detail: { currentPageIndex: number };
  }) => {
    setCurrentPage(event.detail.currentPageIndex);

    if (event.detail.currentPageIndex > currentPage && data?.nextCursor) {
      setCursor(data.nextCursor);
    } else if (event.detail.currentPageIndex < currentPage) {
      setCursor(null);
    }
  };

  return (
    <Container>
      <SpaceBetween size="l">
        <Header variant="h2">Musicals</Header>

        <TextFilter
          filteringText={filterText}
          filteringPlaceholder="Find musicals"
          filteringAriaLabel="Filter musicals"
          onChange={({ detail }) => setFilterText(detail.filteringText)}
        />

        {isLoading || isRetrying ? (
          <LoadingState text="Loading musicals..." />
        ) : error ? (
          <ErrorState
            title="Failed to load musicals"
            message={error.message}
            onRetry={handleRetry}
          />
        ) : filteredMusicals.length === 0 ? (
          <Box textAlign="center">
            <b>No musicals found</b>
            <Box padding={{ bottom: "s" }} variant="p">
              Try adjusting your search or filters.
            </Box>
          </Box>
        ) : (
          <SpaceBetween size="l">
            <MusicalCards musicals={filteredMusicals} />

            <Pagination
              currentPageIndex={currentPage}
              pagesCount={data?.nextCursor ? currentPage + 1 : currentPage}
              onChange={handlePaginationChange}
              ariaLabels={{
                nextPageLabel: "Next page",
                previousPageLabel: "Previous page",
                pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
              }}
            />
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Container>
  );
}
