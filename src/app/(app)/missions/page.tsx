import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MissionsTable from "@/app/(app)/missions/_components/MissionsTable";
import Button from "@mui/material/Button";
import Link from "next/link";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";

export default function MissionPage() {
  return (
    <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "OPERATOR", "ANALYST"]}>
      <div className="pt-24 w-full">
        <Container maxWidth="xl" sx={{display: "flex", flexDirection: 'column', gap: 4}}>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              Missions
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage missions details and settings.
            </Typography>
          </Box>

          <Box sx={{
            ml: 'auto',
            display: 'flex',
            gap: 2
          }}
          >
            <Link href="/missions/create">
              <Button variant="outlined" color="primary">
                Create Mission
              </Button>
            </Link>

          </Box>
          <MissionsTable/>
        </Container>
      </div>
    </ValidateRolesPage>
  );
}