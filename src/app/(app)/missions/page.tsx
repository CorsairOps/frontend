import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MissionsTable from "@/app/(app)/missions/_components/MissionsTable";

export default function MissionPage() {
  return (
    <div className="pt-24 w-full">
      <Container maxWidth="xl" sx={{ display: "flex", flexDirection: 'column', gap: 4}}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Missions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage missions details and settings.
          </Typography>
        </Box>

        <MissionsTable />


      </Container>

    </div>
  );
}