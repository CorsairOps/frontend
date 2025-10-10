"use client";
import {useParams} from "next/navigation";
import {
  useGetAssetById
} from "@/lib/api/services/assetServiceAPI";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import AssetDetails from "./_components/AssetDetails";
import AssetLocations from "./_components/AssetLocations";
import AssetAssignedMissions from "@/app/(app)/assets/[assetId]/_components/AssetAssignedMissions";

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
        <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={"Asset Details"}/>
        <LoadingSpinnerLg/>
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (assetError) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={"Asset Details"}/>
        <p className="text-red-500">Error loading asset: {assetError.message}</p>
      </div>
    );
  }

  if (asset) {
    return (
      <div className="pt-24 p-8 w-full">

        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={asset.name as string}/>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              {asset.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage {asset.name} details and settings.
            </Typography>
          </Box>

          <Box sx={{display: 'grid', gridTemplateColumns: {md: '1fr 1fr 1fr', xs: '1fr'}, gap: 4}}>
            <AssetDetails asset={asset}/>
            <AssetLocations asset={asset}/>
            <AssetAssignedMissions asset={asset} />
          </Box>

        </Container>
      </div>
    )
  }

  return null;
}