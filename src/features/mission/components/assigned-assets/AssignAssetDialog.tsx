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
import {MissionResponse, useAssignAssetToMission} from "@/lib/api/services/missionServiceAPI";
import {useGetAllAssets} from "@/lib/api/services/assetServiceAPI";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useQueryClient} from "@tanstack/react-query";

export default function AssignAssetDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Assign Asset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Assign asset to {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign an asset to this mission.
          </DialogContentText>

          <AssignAssetForm mission={mission} close={() => setOpen(false)}/>

        </DialogContent>
      </Dialog>
    </>
  )
}

function AssignAssetForm({mission, close}: { mission: MissionResponse, close: () => void }) {
  const queryClient = useQueryClient();
  const {data: assets, isLoading: loadingAssets, error: assetsError} = useGetAllAssets();
  const {mutate: assignAsset, isPending: assigningAsset, error: assignAssetError} = useAssignAssetToMission({
    mutation: {
      onSuccess: async () => {
        console.log('Asset assigned successfully');
        await queryClient.invalidateQueries({queryKey: [`/api/missions/assigned-assets/assets/${mission.id}`]})
        close();
      }
    }
  });
  const [filteredAssets, setFilteredAssets] = useState(assets || []);
  const [searchInput, setSearchInput] = useState("");
  const [assetId, setAssetId] = useState<string>("");

  useEffect(() => {
    // Handle filtering assets based on search input
    if (searchInput.trim() === "") {
      setFilteredAssets(assets || []);
    } else {
      // Filter
      const filtered = (assets || []).filter(asset =>
        asset.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.type?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.status?.toLowerCase().includes(searchInput.toLowerCase()) ||
          asset.id?.toLowerCase().includes(searchInput.toLowerCase()));
      setFilteredAssets(filtered);
    }
  }, [assets, searchInput]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!assetId) return;
    assignAsset({params: {missionId: mission.id as number, assetId: assetId}});
  }

  if (loadingAssets) {
    return <LoadingSpinnerSm/>;
  }

  if (assetsError) {
    return <FormError>{assetsError.message}</FormError>;
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
      {assignAssetError && <FormError>{assignAssetError.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={assigningAsset}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={assigningAsset || !assetId}>
          {assigningAsset ? <LoadingSpinnerSm/> : "Assign Asset"}
        </Button>
      </DialogActions>
    </form>
  )
}