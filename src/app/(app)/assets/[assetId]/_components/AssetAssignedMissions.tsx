import {AssetResponse} from "@/lib/api/services/assetServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Typography from "@mui/material/Typography";
import FormError from "@/components/FormError";
import {useGetAssignedMissionsByAssetId} from "@/lib/api/services/missionServiceAPI";
import Link from "next/link";
import {getMissionPriorityColor} from "@/features/mission/mission.util";
import Chip from "@mui/material/Chip";

export default function AssetAssignedMissions({asset}: { asset: AssetResponse }) {

  const {data, isLoading, error} = useGetAssignedMissionsByAssetId(asset.id as string, {
    query: {
      queryKey: ['assetMissions', asset.id]
    }
  });

  return (
    <Box component={Paper} sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, maxHeight: 500, width: "100%"}}>
      <Typography variant="h2" sx={{fontSize: '1.5rem', fontWeight: 'bold', mt: 2}}>
        Assigned Missions
      </Typography>
      <hr/>
      {isLoading && <LoadingSpinnerLg/>}
      {error && <FormError>Error loading locations: {error.message}</FormError>}
      {data && data.length === 0 && <Typography>No Assigned Missions.</Typography>}
      {data && data.length > 0 && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1, overflow: "auto"}}>
          {data.map(mission => (
            <Link key={mission.id} href={`/missions/${mission.id}`}>
              <Box
                sx={{borderRadius: 2, border: '1px solid #ccc', p: 1, '&:hover': {backgroundColor: 'secondary.light'}}}>
                <Typography variant="h3" sx={{fontSize: '1.2rem', fontWeight: 'bold'}}>{mission.name}</Typography>
                <Typography variant="body1">
                  <strong>Priority:</strong> <Chip label={mission.priority} variant="filled" size="small"
                                                   sx={{
                                                     backgroundColor: getMissionPriorityColor(mission.priority as number),
                                                     color: 'white'
                                                   }}
                />
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
              </Box>
            </Link>
          ))}
        </Box>
      )}

    </Box>
  )
}