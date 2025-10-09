"use client";
import {useParams} from "next/navigation";
import {
  AssetResponse,
  useGetAssetById, useGetAssetLocations
} from "@/lib/api/services/assetServiceAPI";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import EditAssetDialog from "@/features/assets/components/EditAssetDialog";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import DeleteAssetDialog from "@/features/assets/components/DeleteAssetDialog";

export default function AssetPage() {
  const params = useParams();
  const assetId = params.assetId;

  const {data: asset, isLoading: isLoadingAsset, error: assetError} = useGetAssetById(assetId as string, {
    query: {
      queryKey: ['asset', assetId]
    }
  });

  if (isLoadingAsset) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={"Asset Details"} />
        <LoadingSpinnerLg/>
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (assetError) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={"Asset Details"} />
        <p className="text-red-500">Error loading asset: {assetError.message}</p>
      </div>
    );
  }

  if (asset) {
    return (
      <div className="pt-24 w-full">

        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={asset.name as string} />
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              {asset.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage {asset.name} details and settings.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: {md: '1fr 1fr 1fr', xs: '1fr'}, gap: 4}}>
            <AssetDetails asset={asset}/>
            <AssetLocations asset={asset} />
          </Box>

        </Container>
      </div>
    )
  }

  return null;
}

function AssetDetails({asset}: { asset: AssetResponse }) {
  return (
    <Box component={Paper} sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, gridColumn: {md: "span 2"}, width: "100%"}}>
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
          <DeleteAssetDialog asset={asset} />
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

function AssetLocations({asset}: { asset: AssetResponse }) {

  const {data, isLoading, error} = useGetAssetLocations(asset.id as string, {
    query: {
      queryKey: ['assetLocations', asset.id]
    }
  });

  return (
    <Box component={Paper} sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, maxHeight: 500,  width: "100%"}}>
      <Typography variant="h2" sx={{fontSize: '1.5rem', fontWeight: 'bold', mt: 2}}>
        Location History
      </Typography>
      <hr/>
      {
        isLoading && <LoadingSpinnerLg/>
      }
      {
        error && <Typography color="error">Error loading locations: {error.message}</Typography>
      }
      {
        data && data.length === 0 && <Typography>No location history available.</Typography>
      }
      {
        data && data.length > 0 && (
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
        )
      }
    </Box>

  )
}