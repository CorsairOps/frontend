import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import MaintenanceOrderTable from "./_components/MaintenanceOrderTable";

export default function MissionPage() {
  return (
    <ValidateRolesPage
      validRoles={["ADMIN", "PLANNER", "OPERATOR", "TECHNICIAN", "ANALYST"]}
    >
      <div className="pt-24 p-8 w-full">
        <Container
          maxWidth="xl"
          sx={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{ fontSize: "2rem", fontWeight: "bold" }}
            >
              Maintenance Orders
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage maintenance orders.
            </Typography>
          </Box>

          <Box
            sx={{
              ml: "auto",
              display: "flex",
              gap: 2,
            }}
          >
            <Link href="/maintenance/create">
              <Button variant="outlined" color="primary">
                Create Maintenance Order
              </Button>
            </Link>
          </Box>
          <MaintenanceOrderTable />
        </Container>
      </div>
    </ValidateRolesPage>
  );
}
