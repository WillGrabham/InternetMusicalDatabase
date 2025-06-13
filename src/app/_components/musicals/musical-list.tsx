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
import { MusicalCards } from "./musical-cards";

interface MusicalListProps {
  session?: Session | null;
}

export function MusicalList({ session }: MusicalListProps = {}) {
  const isAdmin = session?.user?.role === "ADMIN";
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch musicals with pagination
  const { data, isLoading, error } = api.musical.getMusicals.useQuery({
    limit: itemsPerPage,
    cursor: cursor ?? undefined,
    includeUnreleased: isAdmin, // Only include unreleased musicals for admins
  });

  // Filter musicals based on search text
  const filteredMusicals =
    data?.musicals.filter(
      (musical) =>
        musical.title.toLowerCase().includes(filterText.toLowerCase()) ||
        musical.description.toLowerCase().includes(filterText.toLowerCase()),
    ) ?? [];

  // Handle pagination
  const handlePaginationChange = (event: {
    detail: { currentPageIndex: number };
  }) => {
    setCurrentPage(event.detail.currentPageIndex);

    // If going to next page and we have a nextCursor, use it
    if (event.detail.currentPageIndex > currentPage && data?.nextCursor) {
      setCursor(data.nextCursor);
    }
    // If going back to previous page, reset cursor
    else if (event.detail.currentPageIndex < currentPage) {
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

        {isLoading ? (
          <Box>Loading musicals...</Box>
        ) : error ? (
          <Box color="text-status-error">
            Error loading musicals: {error.message}
          </Box>
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
