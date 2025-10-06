'use client';
import {signOut} from "next-auth/react";
import {useEffect} from "react";
import {LoadingSpinnerLg} from "@/components/loading-spinner";

export default function LogoutPage() {

  async function handleLogout() {
    await signOut({redirect: false});
    window.location.href = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URL!;
  }

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinnerLg/>
    </div>
  )
}