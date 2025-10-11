import {
  MissionResponse,
  useGetUsersAssignedToMission
} from "@/lib/api/services/missionServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import Link from "next/link";
import AssignUserDialog from "@/features/mission/components/assigned-users/AssignUserDialog";
import UnassignUserDialog from "@/features/mission/components/assigned-users/UnassignUserDialog";

export default function MissionAssignedUsers({mission}: {
  mission: MissionResponse;
}) {

  const {data, isLoading, error} = useGetUsersAssignedToMission(mission.id as number);

  return (
    <Box component={Paper} sx={{p: 2, width: '100%'}}>
      <Typography variant="h2" sx={{fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
        Assigned Users
      </Typography>
      <Box sx={{width: '100%', display: 'flex', gap: 1, mb: 2}}>
        <AssignUserDialog mission={mission}/>
        <UnassignUserDialog mission={mission}/>
      </Box>
      {isLoading && <LoadingSpinnerMd/>}
      {error && <FormError>{error.message}</FormError>}
      {!isLoading && !error && data && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto'}}>
          {data.length === 0 ? (
            <Typography variant="body1" color="textSecondary">No assigned users.</Typography>
          ) : (
            data.map(user => (
              <Link key={user.id} href={`/users/${user.id}`}>
                <Box sx={{
                  p: 1, border: '1px solid #ccc', borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'secondary.light'
                  }
                }}
                >
                  <Typography variant="h3" sx={{fontSize: '1rem'}}>
                    <strong>Name:</strong> {user.lastName ?? "N/A"}, {user.firstName ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>ID:</strong> {user.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Roles:</strong> {user.roles?.join(', ')}
                  </Typography>
                </Box>
              </Link>
            ))
          )}
        </Box>
      )}

    </Box>
  )

}