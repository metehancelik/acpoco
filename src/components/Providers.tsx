"use client";

import { SessionProvider } from "next-auth/react";

import { TanstackProvider } from "@/components/tanstack/tanstack-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>{children}</TanstackProvider>
    </SessionProvider>
  );
}
