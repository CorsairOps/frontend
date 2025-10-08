'use client';
import {useEffect} from "react";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function LogoutPage() {
  const router = useRouter();
  const {data: session} = useSession();

  function handleLogout() {
    const logoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL!}&id_token_hint=${session?.idToken}`;
    router.push(logoutUrl);
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