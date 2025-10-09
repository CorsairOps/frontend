import DeleteAssetDialog from "@/features/assets/components/DeleteAssetDialog";
import EditAssetDialog from "@/features/assets/components/EditAssetDialog";
import {Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {AssetResponse} from "@/lib/api/services/assetServiceAPI";

export default function AssetDetails({asset}: { asset: AssetResponse }) {
  return (
    <Box component={Paper}
         sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, gridColumn: {md: "span 2"}, width: "100%"}}>
      <Box sx={{
        display: 'flex',
        flexDirection: {md: 'row', xs: 'column'},
        justifyContent: 'space-between',
        alignItems: {md: 'center', xs: 'flex-start'},
        gap: 2,
        borderBottom: '1px solid primary.main',
        pb: 1
      }}>
        <Typography variant="h2" sx={{fontSize: '1.5rem', fontWeight: 'bold'}}>
          {asset.name}
        </Typography>

        <Box sx={{display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
          <EditAssetDialog asset={asset}/>
          <DeleteAssetDialog asset={asset}/>
        </Box>
      </Box>
      <hr/>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <Typography variant="body1">
          <strong>ID:</strong> {asset.id as string}
        </Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {asset.name as string}
        </Typography>
        <Typography variant="body1">
          <strong>Type:</strong> {asset.type as string}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {asset.status as string}
        </Typography>
        <Typography variant="body1">
          <strong>Current Latitude:</strong> {asset.latitude as number}
        </Typography>
        <Typography variant="body1">
          <strong>Current Longitude:</strong> {asset.longitude as number}
        </Typography>
        <Typography variant="body1">
          <strong>Created At:</strong> {new Date(asset.createdAt as string).toLocaleString()}
        </Typography>
        <Typography variant="body1">
          <strong>Updated At:</strong> {new Date(asset.updatedAt as string).toLocaleString()}
        </Typography>
      </Box>
    </Box>

  )
}