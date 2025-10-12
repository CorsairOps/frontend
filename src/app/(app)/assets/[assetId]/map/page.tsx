"use client";
import {useParams} from "next/navigation";
import {
  useGetAssetById,
  useGetAssetLocations
} from "@/lib/api/services/assetServiceAPI";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {LocationMap} from "@/components/map/LocationMap";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";

export default function AssetMapPage() {
  const params = useParams();
  const assetId = params.assetId;

  const {data: asset, isLoading: isLoadingAsset, error: assetError} = useGetAssetById(assetId as string);
  const {
    data: assetLocations,
    isLoading: isLoadingAssetLocations,
    error: assetLocationsError
  } = useGetAssetLocations(assetId as string);

  if (isLoadingAsset || isLoadingAssetLocations) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs
          links={[{label: "Assets", href: "/assets"}, {label: "Asset Details", href: `/assets/${assetId}`}]}
          current={"Map"}/>
        <LoadingSpinnerLg/>
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (assetError || !asset || assetLocationsError || !assetLocations) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs
          links={[{label: "Assets", href: "/assets"}, {label: "Asset Details", href: `/assets/${assetId}`}]}
          current={"Map"}/>
        <Typography color="error">
          Failed to load asset details.
        </Typography>
        {assetError && <p className="text-red-500">Error loading asset: {assetError.message}</p>}
        {assetLocationsError &&
            <p className="text-red-500">Error loading asset locations: {assetLocationsError.message}</p>
        }
      </div>
    );
  }

  return (
    <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "OPERATOR", "ANALYST"]}>
      <div className="pt-24 p-8 w-full min-h-screen">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4, height: '100%'}}>
          <PageBreadcrumbs
            links={[{label: "Assets", href: "/assets"}, {label: `${asset.name}`, href: `/assets/${assetId}`}]}
            current={"Map"}/>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              {asset.name} Map
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and view {asset.name} locations.
            </Typography>
          </Box>
          <LocationMap assets={[asset]} assetLocations={assetLocations}/>
        </Container>
      </div>
    </ValidateRolesPage>
  );
}