import {MissionResponse, useGetAssignedAssetsByMissionId} from "@/lib/api/services/missionServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import Link from "next/link";
import AssignAssetDialog from "@/features/mission/components/assigned-assets/AssignAssetDialog";
import UnassignAssetDialog from "@/features/mission/components/assigned-assets/UnassignAssetDialog";
import Button from "@mui/material/Button";

export default function MissionAssignedAssets({mission}: {
  mission: MissionResponse;
}) {

  const {data, isLoading, error} = useGetAssignedAssetsByMissionId(mission.id as number);

  return (
    <Box component={Paper} sx={{p: 2, width: '100%'}}>
      <Typography variant="h2" sx={{fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
        Assigned Assets
      </Typography>
      <Box sx={{width: '100%', display: 'flex', gap: 1, mb: 2}}>
        <AssignAssetDialog mission={mission} />
        <UnassignAssetDialog mission={mission} />
        <Link href={`/missions/${mission.id}/map`}>
          <Button variant="outlined">
            View on Map
          </Button>
        </Link>
      </Box>
      {isLoading && <LoadingSpinnerMd/>}
      {error && <FormError>{error.message}</FormError>}
      {!isLoading && !error && data && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1,  maxHeight: 400, overflowY: 'auto'}}>
          {data.length === 0 ? (
            <Typography variant="body1" color="textSecondary">No assigned assets.</Typography>
          ) : (
            data.map(asset => (
              <Link key={asset.id} href={`/assets/${asset.id}`}>
                <Box sx={{
                  p: 1, border: '1px solid #ccc', borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'secondary.light'
                  }
                }}
                >
                  <Typography variant="h3" sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                    {asset.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>ID:</strong> {asset.id}
                  </Typography>
                  <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                    <Typography variant="body1">
                      <strong>Type:</strong> {asset.type}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong> {asset.status}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Location:</strong> {asset.latitude}, {asset.longitude}
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