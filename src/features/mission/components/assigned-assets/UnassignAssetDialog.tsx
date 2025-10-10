"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useSession} from "next-auth/react";
import {FormEvent, useEffect, useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {
  MissionResponse,
  useGetAssignedAssetsByMissionId,
  useUnassignAssetFromMission
} from "@/lib/api/services/missionServiceAPI";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useQueryClient} from "@tanstack/react-query";

export default function UnassignAssetDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Unassign Asset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Unassign asset from {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unassign an asset from this mission.
          </DialogContentText>

          <UnassignAssetForm mission={mission} close={() => setOpen(false)}/>

        </DialogContent>
      </Dialog>
    </>
  )
}

function UnassignAssetForm({mission, close}: { mission: MissionResponse, close: () => void }) {
  const queryClient = useQueryClient();
  const {data: assignedAssets, isLoading:loadingAssignedAssets, error: assignedAssetsError} = useGetAssignedAssetsByMissionId(mission.id as number);
  const {mutate: unassignAsset, isPending: unassigning, error: unassignAssetError} = useUnassignAssetFromMission({
    mutation: {
      onSuccess: async () => {
        console.log('Asset unassigned successfully');
        await queryClient.invalidateQueries({queryKey: [`/api/missions/assigned-assets/assets/${mission.id}`]})
        close();
      }
    }
  });
  const [filteredAssets, setFilteredAssets] = useState(assignedAssets || []);
  const [searchInput, setSearchInput] = useState("");
  const [assetId, setAssetId] = useState<string>("");

  useEffect(() => {
    // Handle filtering assets based on search input
    if (searchInput.trim() === "") {
      setFilteredAssets(assignedAssets || []);
    } else {
      // Filter
      const filtered = (assignedAssets || []).filter(asset =>
        asset.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.type?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.status?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.id?.toLowerCase().includes(searchInput.toLowerCase()));
      setFilteredAssets(filtered);
    }
  }, [assignedAssets, searchInput]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!assetId) return;
    unassignAsset({params: {missionId: mission.id as number, assetId: assetId}});
  }

  if (loadingAssignedAssets) {
    return <LoadingSpinnerSm/>;
  }

  if (assignedAssetsError) {
    return <FormError>{assignedAssetsError.message}</FormError>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField id="search-assets" label="Search Assets" placeholder="Search by name, type, status or ID"
                 autoFocus
                 fullWidth variant="outlined"
                 value={searchInput}
                 onChange={(e) => setSearchInput(e.target.value)}
      />

      {filteredAssets.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No assets found.</Typography>
      ) : (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 300, overflowY: 'auto'}}>
          {filteredAssets.map(asset => (
            <Box key={asset.id} sx={{
              p: 1,
              border: '1px solid #ccc',
              borderRadius: 1,
              backgroundColor: assetId === asset.id ? 'secondary.light' : 'transparent',
              cursor: 'pointer',
              '&:hover': {backgroundColor: 'secondary.light'},
              '&:active': {backgroundColor: 'secondary.main'}
            }}
                 onClick={() => setAssetId(asset.id as string)}
            >
              <Typography variant="h4" sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                {asset.name}
              </Typography>
              <Typography variant="body1">
                <strong>ID:</strong> {asset.id}
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong> {asset.type}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {asset.status}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {unassignAssetError && <FormError>{unassignAssetError.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={unassigning}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={unassigning || !assetId}>
          {unassigning ? <LoadingSpinnerSm/> : "Unassign Asset"}
        </Button>
      </DialogActions>
    </form>
  )
}