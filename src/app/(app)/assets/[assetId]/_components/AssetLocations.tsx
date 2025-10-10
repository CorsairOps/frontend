import {AssetResponse, useGetAssetLocations} from "@/lib/api/services/assetServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerLg} from "@/components/loading-spinner";

export default function AssetLocations({asset}: { asset: AssetResponse }) {

  const {data, isLoading, error} = useGetAssetLocations(asset.id as string);

  return (
    <Box component={Paper} sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, maxHeight: 500, width: "100%"}}>
      <Typography variant="h2" sx={{fontSize: '1.5rem', fontWeight: 'bold', mt: 2}}>
        Location History
      </Typography>
      <hr/>
      {isLoading && <LoadingSpinnerLg/>}
      {error && <Typography color="error">Error loading locations: {error.message}</Typography>}
      {data && data.length === 0 && <Typography>No location history available.</Typography>}
      {data && data.length > 0 && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mt: 1, overflow: "auto"}}>
          {data.map(location => (
            <Box key={location.id} sx={{borderBottom: '1px solid #ccc', pb: 1}}>
              <Typography variant="body1">
                <strong>Location: </strong>{location.latitude}, {location.longitude}
              </Typography>
              <Typography variant="body1">
                <strong>Timestamp:</strong> {new Date(location.timestamp as string).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>

  )
}