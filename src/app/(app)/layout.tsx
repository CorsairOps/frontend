import AuthOnlyPage from "@/features/auth/components/AuthOnlyPage";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";

export default function AppLayout({children}: { children: React.ReactNode }) {

  return (
    <AuthOnlyPage>
      <ValidateRolesPage validRoles={["ANALYST", "OPERATOR", "PLANNER", "ADMIN", "TECHNICIAN"]}>
        {children}
      </ValidateRolesPage>
    </AuthOnlyPage>
  )

}