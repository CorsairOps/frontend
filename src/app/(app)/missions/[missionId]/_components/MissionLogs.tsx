import {MissionResponse, useGetMissionLogsForMission} from "@/lib/api/services/missionServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import AddMissionLogDialog from "@/features/mission/components/logs/AddMissionLogDialog";
import DeleteMissionLogDialog from "@/features/mission/components/logs/DeleteMissionLogDialog";

export default function MissionLogs({mission}: {
  mission: MissionResponse;
}) {

  const {data, isLoading, error} = useGetMissionLogsForMission(mission.id as number);
  return (
    <Box component={Paper} sx={{p: 2, gridColumn: {lg: 'span 3'}}}>
      <Typography variant="h2" sx={{fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
        Mission Logs
      </Typography>
      <Box sx={{width: '100%', display: 'flex', gap: 1, mb: 2}}>
        <AddMissionLogDialog mission={mission}/>
      </Box>
      {isLoading && <LoadingSpinnerMd/>}
      {error && <FormError>{error.message}</FormError>}
      {!isLoading && !error && data && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 600, overflowY: 'auto', width: '100%'}}>
          {data.length === 0 ? (
            <Typography variant="body1" color="textSecondary">No mission logs.</Typography>
          ) : (
            data.map(log => (
              <Box key={log.id}
                   sx={{p: 1, border: '0px solid #ccc', borderRadius: 1, width: '100%', position: 'relative'}}>
                <div className="ml-auto absolute top-2 right-2">
                  <DeleteMissionLogDialog log={log}/>
                </div>
                <Typography variant="body1">
                  <strong>Created By:</strong> {log.createdBy ? (
                  log.createdBy.lastName || log.createdBy.firstName ? `${log.createdBy.lastName}, ${log.createdBy.firstName}` : log.createdBy.id
                ) : "N/A"}
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