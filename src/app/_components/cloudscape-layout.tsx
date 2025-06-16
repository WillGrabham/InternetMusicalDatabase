"use client";

import { AppLayout } from "@cloudscape-design/components";
import type { ReactNode } from "react";

interface CloudscapeLayoutProps {
  children: ReactNode;
}

export function CloudscapeLayout({ children }: CloudscapeLayoutProps) {
  return (
    <AppLayout content={children} navigationHide={true} toolsHide={true} />
  );
}
