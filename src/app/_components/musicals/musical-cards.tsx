"use client";

import {
  Box,
  Button,
  Cards,
  SpaceBetween,
} from "@cloudscape-design/components";
import type { Musical } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MusicalCardProps {
  musicals: Musical[];
}

export function MusicalCards({ musicals }: MusicalCardProps) {
  const router = useRouter();

  return (
    <Cards
      ariaLabels={{
        itemSelectionLabel: (e, n) => `select ${n.title}`,
        selectionGroupLabel: "Musical selection",
      }}
      cardDefinition={{
        header: (item) => (
          <Box fontWeight="bold" fontSize="heading-m">
            {item.title}
          </Box>
        ),
        sections: [
          {
            id: "image",
            content: (item) => (
              <div
                style={{ position: "relative", width: "100%", height: "200px" }}
              >
                <Image
                  src={item.posterUrl}
                  alt={`${item.title} poster`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ),
          },
          {
            id: "description",
            header: "Description",
            content: (item) => (
              <Box variant="p" color="text-body-secondary">
                {item.description.length > 150
                  ? `${item.description.substring(0, 150)}...`
                  : item.description}
              </Box>
            ),
          },
          {
            id: "releaseDate",
            header: "Release Date",
            content: (item) => new Date(item.releaseDate).toLocaleDateString(),
          },
          {
            id: "actions",
            content: (item) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => router.push(`/musicals/${item.id}`)}>
                  View Details
                </Button>
              </SpaceBetween>
            ),
          },
        ],
      }}
      items={musicals}
      loadingText="Loading musical"
      trackBy="id"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No musical found</b>
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No musical matches the criteria.
          </Box>
        </Box>
      }
    />
  );
}
