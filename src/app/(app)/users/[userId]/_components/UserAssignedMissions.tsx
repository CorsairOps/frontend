import {User} from "@/lib/api/services/userServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {useGetMissionsAssignedToUser} from "@/lib/api/services/missionServiceAPI";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import Link from "next/link";

export default function UserAssignedMissions({user}: { user: User }) {

  const {
    data: missions,
    isLoading: isLoadingMissions,
    error: missionsError
  } = useGetMissionsAssignedToUser(user.id as string);

  return (
    <Box component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 1}}>
      <Typography variant="h2" sx={{fontSize: '1.5rem', fontWeight: 'bold'}}>
        Assigned Missions
      </Typography>
      {isLoadingMissions && <LoadingSpinnerMd/>}
      {missionsError && <FormError>{missionsError.message}</FormError>}
      {missions && missions.length === 0 && (
        <Typography variant="body1">
          No missions assigned.
        </Typography>
      )}
      {missions && missions.length > 0 && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: '400px'}}>
          {missions.map(mission => (
            <Link key={mission.id} href={`/missions/${mission.id}`}>
              <Box
                sx={{p: 1, border: '1px solid', borderColor: 'secondary.main', borderRadius: '4px', cursor: 'pointer', '&:hover': {backgroundColor: 'action.hover'}}}>
                <Typography variant="h3" sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                  <strong>Name:</strong> {mission.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {mission.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Start Date:</strong> {mission.startDate}
                </Typography>
                <Typography variant="body2">
                  <strong>End Date:</strong> {mission.endDate ?? "N/A"}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}

    </Box>

  )
}