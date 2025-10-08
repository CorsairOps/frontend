import AuthOnlyPage from "@/features/auth/components/AuthOnlyPage";
import React from "react";

export default function ProfileLayout({children}: {children: React.ReactNode}) {
  return (
    <AuthOnlyPage>
      {children}
    </AuthOnlyPage>
  )
}