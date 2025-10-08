"use client";
import Button from "@mui/material/Button";
import {signIn, signOut, useSession} from "next-auth/react";

export default function LoginBtn() {
  const {data: session} = useSession();

  async function handleLogout() {
    await signOut({redirect: false});
    window.location.href = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL!;
  }

  if (session) {
    return (
      <Button variant="outlined" onClick={handleLogout}>
        Sign Out
      </Button>
    )
  }

  return (
    <Button variant="contained" onClick={() => signIn("keycloak")}>
      Sign In
    </Button>
  )
}