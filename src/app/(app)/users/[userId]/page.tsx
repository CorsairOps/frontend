"use client";

import {useParams} from "next/navigation";
import {useGetUserById} from "@/lib/api/services/userServiceAPI";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import Container from "@mui/material/Container";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import UserDetails from "@/app/(app)/users/[userId]/_components/UserDetails";
import UserAssignedMissions from "@/app/(app)/users/[userId]/_components/UserAssignedMissions";

export default function UserPage() {
  const params = useParams();
  const userId = params.userId;

  const {data: user, isLoading: isLoadingUser, error: userError} = useGetUserById(userId as string);

  if (isLoadingUser) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Users", href: "/users"}]} current={"User Details"}/>
        <LoadingSpinnerLg/>
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Users", href: "/users"}]} current={"User Details"}/>
        <FormError>{userError?.message || "Failed to load user details."}</FormError>
      </div>
    )
  }

  return (
    <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "ANALYST"]}>
      <div className="pt-24 p-8 w-full">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Users", href: "/users"}]} current={`${user.firstName} ${user.lastName}`}/>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View {user.firstName} {user.lastName} details and settings.
            </Typography>
          </Box>

          <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', lg: '1fr 1fr'}, gap: 2}}>
            <UserDetails user={user} />
            <UserAssignedMissions user={user} />
          </Box>

        </Container>
      </div>
    </ValidateRolesPage>
  )
}