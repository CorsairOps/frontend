"use client";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {useParams} from "next/navigation";
import {useGetMissionById} from "@/lib/api/services/missionServiceAPI";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Box from "@mui/material/Box";
import MissionDetails from "@/app/(app)/missions/[missionId]/_components/MissionDetails";
import MissionAssignedAssets from "@/app/(app)/missions/[missionId]/_components/MissionAssignedAssets";
import MissionAssignedUsers from "@/app/(app)/missions/[missionId]/_components/MissionAssignedUsers";
import MissionLogs from "@/app/(app)/missions/[missionId]/_components/MissionLogs";

export default function MissionPage() {
  const params = useParams();
  const missionId = params.missionId;

  const {
    data: mission,
    isLoading: loadingMission,
    error: missionError
  } = useGetMissionById(parseInt(missionId as string));

  if (loadingMission) {
    return <LoadingSpinnerLg/>;
  }

  if (missionError) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Missions", href: "/missions"}]} current={"Mission Details"}/>
        <Typography variant="body1" color="error">
          {`Error loading mission: ${missionError.message}`}
        </Typography>
      </div>
    );
  }

  if (mission) {
    return (
      <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "OPERATOR", "ANALYST"]}>
        <div className="pt-24 p-8 w-full">
          <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <PageBreadcrumbs links={[{label: "Missions", href: "/missions"}]} current={mission.name as string}/>
            <Box>
              <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
                {mission.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Manage {mission.name} details and settings.
              </Typography>
            </Box>

            <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', lg: '1fr 1fr 1fr'}, gap: 2}}>
              <MissionDetails mission={mission}/>
              <MissionAssignedAssets mission={mission} />
              <MissionAssignedUsers mission={mission} />
              <MissionLogs mission={mission} />
            </Box>

          </Container>
        </div>

      </ValidateRolesPage>
    )
  }
  return null;
}