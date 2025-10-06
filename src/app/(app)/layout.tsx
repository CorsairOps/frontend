import AuthOnlyPage from "@/features/auth/components/AuthOnlyPage";

export default function AppLayout({children}: {children: React.ReactNode}) {

  return (
    <AuthOnlyPage>
      {children}
    </AuthOnlyPage>
  )

}