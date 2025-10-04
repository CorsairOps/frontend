"use client";
import {signIn, signOut, useSession} from "next-auth/react";

export default function LoginBtn() {
  const {data: session} = useSession();

  async function handleLogout() {
    await signOut({redirect: false});
    window.location.href = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URL!;
  }

  if (session) {
    return (
      <button onClick={() => handleLogout()}>
        Sign Out
      </button>
    )
  }

  return (
    <button onClick={() => signIn("cognito")}>Sign In</button>
  )
}