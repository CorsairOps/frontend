"use client";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import {AssetResponse, useDeleteAsset} from "@/lib/api/services/assetServiceAPI";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";

export default function DeleteAssetDialog({asset}: { asset: AssetResponse }) {
  const router = useRouter();
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  const {mutate, isPending, error} = useDeleteAsset({
    mutation: {
      onSuccess: () => {
        console.log('Asset deleted successfully');
        router.push('/assets');
        setOpen(false);
      }
    }
  });

  function handleDelete() {
    mutate({id: asset.id as string});
  }

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => setOpen(true)}>
        Delete Asset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete {asset.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this asset? This action cannot be undone. All associated data will be
            permanently removed.
          </DialogContentText>
          {error && <FormError>{error.message}</FormError>}
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={isPending}>
              {isPending ? <LoadingSpinnerSm/> : 'Delete'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}