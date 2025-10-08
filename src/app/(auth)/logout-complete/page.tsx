"use client";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {signOut} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function LogoutCompletePage() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({redirect: false});
    router.push("/");
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