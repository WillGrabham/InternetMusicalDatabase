"use client";

import { AppLayout } from "@cloudscape-design/components";

export function CloudscapeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout content={children} navigationHide={true} toolsHide={true} />
  );
}
