import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import UsersTable from "@/app/(app)/users/_components/UsersTable";

export default function UsersPage() {
  return (
    <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "ANALYST"]}>
      <div className="pt-24 p-8 w-full">
        <Container maxWidth="xl" sx={{display: "flex", flexDirection: 'column', gap: 4}}>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              Users
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View and manage users.
            </Typography>
          </Box>
          <UsersTable />
        </Container>
      </div>
    </ValidateRolesPage>
  )
}