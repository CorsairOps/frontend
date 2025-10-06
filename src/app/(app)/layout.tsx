import AuthOnlyPage from "@/features/auth/components/AuthOnlyPage";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";

export default function AppLayout({children}: { children: React.ReactNode }) {

  return (
    <AuthOnlyPage>
      <ValidateRolesPage validRoles={["ANALYST", "OPERATOR", "PLANNER", "ADMIN"]} forbiddenRoles={["EX_MEMBER"]}>
        {children}
      </ValidateRolesPage>
    </AuthOnlyPage>
  )

}