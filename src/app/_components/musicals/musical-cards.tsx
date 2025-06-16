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
import { useState } from "react";

interface MusicalCardProps {
  musicals: Musical[];
}

export function MusicalCards({ musicals }: MusicalCardProps) {
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

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
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "150%", // 2:3 aspect ratio for movie posters
                  backgroundColor: "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={item.posterUrl}
                  alt={`${item.title} poster`}
                  fill
                  style={{
                    objectFit: "cover",
                    opacity: loadedImages[item.id] ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoadingComplete={() => handleImageLoad(item.id)}
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
