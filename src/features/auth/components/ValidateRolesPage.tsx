"use client";
import React from "react";
import {useSession} from "next-auth/react";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoginBtn from "@/components/LoginBtn";

export default function ValidateRolesPage({children, validRoles, forbiddenRoles = []}: {
  children: React.ReactNode;
  validRoles: string[];
  forbiddenRoles?: string[];
}) {

  const {status, data: session} = useSession();

  if (status === "loading") {
    return (
      <div className="pt-24 flex items-center justify-center">
        <LoadingSpinnerLg/>
      </div>
    );
  }

  else if (status === "unauthenticated" || !session) {
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

  else if (!session.user.roles || session.user.roles.length === 0 || !validRoles.some(role => session.user.roles.includes(role)) || forbiddenRoles.some(role => session.user.roles.includes(role))) {
    return (
      <div className='pt-24 flex items-center justify-center'>
        <Container maxWidth="xl" className="flex flex-col items-center">
          <Typography variant="h1" sx={{
            fontSize: '2rem'
          }} gutterBottom
          >
            You do not have permission to view this page.
          </Typography>
          <Typography variant="body1" sx={{mb: 2}}>
            Valid Roles: {validRoles.join(", ")}
          </Typography>

          {forbiddenRoles.length > 0 && (
            <Typography variant="body1" sx={{mb: 2}}>
              Forbidden Roles: {forbiddenRoles.join(", ")}
            </Typography>
          )}
        </Container>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  )

}