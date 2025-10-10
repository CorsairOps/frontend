import {MissionResponse, useGetMissionLogsForMission} from "@/lib/api/services/missionServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";

export default function MissionLogs({mission}: {
  mission: MissionResponse;
}) {

  const {data, isLoading, error} = useGetMissionLogsForMission(mission.id as number);
  return (
    <Box component={Paper} sx={{p: 2, gridColumn: {lg: 'span 3'}}}>
      <Typography variant="h2" sx={{fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
        Mission Logs
      </Typography>
      {isLoading && <LoadingSpinnerMd/>}
      {error && <FormError>{error.message}</FormError>}
      {!isLoading && !error && data && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 600, overflowY: 'auto'}}>
          {data.length === 0 ? (
            <Typography variant="body1" color="textSecondary">No mission logs.</Typography>
          ) : (
            data.map(log => (
              <Box key={log.id} sx={{p: 1, border: '0px solid #ccc', borderRadius: 1}}>
                <Typography variant="body1">
                  <strong>Created By:</strong> {log.createdBy?.lastName}, {log.createdBy?.firstName}
                </Typography>
                <Typography variant="body1">
                  <strong>Timestamp:</strong> {new Date(log.timestamp as string).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Entry:</strong> {log.entry}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  )
}