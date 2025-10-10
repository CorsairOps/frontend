import {MissionResponse} from "@/lib/api/services/missionServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import EditMissionDialog from "@/features/mission/components/EditMissionDialog";

export default function MissionDetails({mission}: {
  mission: MissionResponse;
}) {
  return (
    <Box component={Paper} sx={{p: 2, width: '100%'}}>
      <Typography variant="h2" sx={{fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
        {mission.name}
      </Typography>
      <Box sx={{ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2}}>
        <EditMissionDialog mission={mission} />
      </Box>
      <Typography variant="body1">
        <strong>ID:</strong> {mission.id}
      </Typography>
      <Typography variant="body1">
        <strong>Priority:</strong> {mission.priority}
      </Typography>
      <Typography variant="body1">
        <strong>Status:</strong> {mission.status}
      </Typography>
      <Typography variant="body1">
        <strong>Start:</strong> {mission.startDate}
      </Typography>
      <Typography variant="body1">
        <strong>End:</strong> {mission.endDate ?? "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Created By:</strong> {mission.createdBy?.lastName}, {mission.createdBy?.firstName}
      </Typography>
      <Typography variant="body1">
        <strong>Created At:</strong> {new Date(mission.createdAt as string).toLocaleString()}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {mission.description}
      </Typography>
    </Box>

  )
}