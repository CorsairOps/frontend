"use client";
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";
import {AuthProvider} from "@/features/auth/auth.context";

export default function Providers({children}: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  )

}