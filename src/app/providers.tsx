"use client";
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";
import {AuthProvider} from "@/features/auth/auth.context";
import {Theme, ThemeProvider, createTheme} from "@mui/material/styles";
import {teal, amber} from '@mui/material/colors';

export default function Providers({children}: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
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