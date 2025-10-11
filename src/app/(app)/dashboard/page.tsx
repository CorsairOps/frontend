import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AssetsCount from "@/app/(app)/dashboard/_components/AssetsCount";
import MissionCount from "@/app/(app)/dashboard/_components/MissionCount";
import UserCount from "./_components/UserCount";
import ViewAndManagePanel from "@/app/(app)/dashboard/_components/ViewAndManagePanel";
import {AirlineStops, DirectionsBoatFilled, People } from "@mui/icons-material";

export default function Dashboard() {
  return (
    <div className="pt-24 p-8 w-full">
      <Container maxWidth="xl">
        <Typography variant="h1" gutterBottom sx={{
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Dashboard
        </Typography>

        <Box sx={{mt: 4, display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr'}, gap: 4}}>
          <AssetsCount/>
          <MissionCount/>
          <UserCount />

          <ViewAndManagePanel label={"Manage Assets"} description={"View and manage all assets."} href={"/assets"} iconNode={<DirectionsBoatFilled />} />
          <ViewAndManagePanel label={"Manage Missions"} description={"View and manage all missions."} href={"/missions"} iconNode={<AirlineStops />} />
          <ViewAndManagePanel label={"Manage Users"} description={"View and manage all users."} href={"/users"} iconNode={<People />} />
        </Box>
      </Container>
    </div>
  )
}