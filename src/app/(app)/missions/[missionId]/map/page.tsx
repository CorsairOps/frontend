"use client";
import {useParams} from "next/navigation";
import {useGetAssignedAssetsByMissionId, useGetMissionById} from "@/lib/api/services/missionServiceAPI";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import Typography from "@mui/material/Typography";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import FormError from "@/components/FormError";
import {useMemo} from "react";
import {AssetLocationResponse} from "@/lib/api/services/assetServiceAPI";
import {LocationMap} from "@/components/map/LocationMap";
import Button from "@mui/material/Button";
import {Refresh} from "@mui/icons-material";

export default function MissionMapPage() {
  const params = useParams();
  const missionId = params.missionId;

  const {
    data: mission,
    isLoading: loadingMission,
    error: missionError
  } = useGetMissionById(parseInt(missionId as string));
  const {
    data: missionAssets,
    isLoading: loadingMissionAssets,
    error: missionAssetsError,
    refetch: refetchMissionAssets
  } = useGetAssignedAssetsByMissionId(parseInt(missionId as string));

  const assetLocations: AssetLocationResponse[] = useMemo(() => {
    if (missionAssets) {
      return missionAssets.map((asset, idx) => ({
        id: idx,
        assetId: asset.id,
        latitude: asset.latitude,
        longitude: asset.longitude,
        timestamp: asset.updatedAt
      }));
    } else {
      return [];
    }
  }, [missionAssets]);

  console.log("Asset Locations:", assetLocations);

  const breadcrumbs = [
    {label: "Missions", href: "/missions"},
    {label: mission?.name as string ?? "Mission Details", href: `/missions/${missionId}`},
  ];

  if (loadingMission || loadingMissionAssets) {
    return <LoadingSpinnerLg/>;
  }

  if (missionError || !mission || missionAssetsError || !missionAssets) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={breadcrumbs} current="Map"/>
        <Typography variant="h4" color="error">
          Error loading mission or mission assets.
        </Typography>
        {missionError && (<FormError>{missionError.message}</FormError>)}
        {missionAssetsError && (<FormError>{missionAssetsError.message}</FormError>)}
      </div>
    );
  }

  return (
    <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "OPERATOR", "ANALYST"]}>
      <div className="pt-24 p-8 w-full min-h-screen">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4, height: '100%'}}>
          <PageBreadcrumbs links={breadcrumbs} current="Map"/>
          <Box>
            <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
              {mission.name} Map
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View and Manage mission asset locations.
            </Typography>
          </Box>
          <Button startIcon={<Refresh/>} variant="outlined" onClick={() => refetchMissionAssets()} sx={{ml: 'auto'}} disabled={loadingMissionAssets}>
            Refresh Locations
          </Button>
          <LocationMap assets={missionAssets} assetLocations={assetLocations} pingAll={true}/>
        </Container>
      </div>
    </ValidateRolesPage>
  );

}