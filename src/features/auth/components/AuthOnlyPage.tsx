"use client";

import {useSession} from "next-auth/react";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoginBtn from "@/components/LoginBtn";

export default function AuthOnlyPage({children}: { children: React.ReactNode }) {

  const {status} = useSession();
  if (status === "loading") {
    return (
      <div className="pt-24 flex items-center justify-center">
        <LoadingSpinnerLg/>
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className='pt-24 flex items-center justify-center'>
        <Container maxWidth="xl" className="flex flex-col items-center">
          <Typography variant="h1" sx={{
            fontSize: '2rem'
          }} gutterBottom
          >
            You must be signed in to view this page.
          </Typography>
          <LoginBtn/>
        </Container>
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}