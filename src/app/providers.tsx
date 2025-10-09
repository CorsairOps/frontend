"use client";
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";
import {AuthProvider} from "@/features/auth/context/auth.context";
import {Theme, ThemeProvider, createTheme} from "@mui/material/styles";

export default function Providers({children}: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: false
      }
    }
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthProvider>
          <ColorThemeProvider>
            {children}
          </ColorThemeProvider>
        </AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

function ColorThemeProvider({children}: { children: React.ReactNode }) {

  const theme: Theme = createTheme({
    palette: {
      primary: {
        main: '#25486d', // Navy Blue
        dark: '#1b3550',
        light: '#3a5a82',
        contrastText: '#ffffff',
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}