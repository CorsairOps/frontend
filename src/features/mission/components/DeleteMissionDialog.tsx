"use client";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {MissionResponse, useDeleteMission} from "@/lib/api/services/missionServiceAPI";
import {useQueryClient} from "@tanstack/react-query";
import TextField from "@mui/material/TextField";

export default function DeleteMissionDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => setOpen(true)}>
        Delete Mission
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this mission? This action cannot be undone. All associated data will be
            permanently removed.
          </DialogContentText>
          <DeleteForm mission={mission} close={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteForm({mission, close}: { mission: MissionResponse; close: () => void; }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {mutate, isPending, error} = useDeleteMission({
    mutation: {
      onSuccess: () => {
        console.log('Mission deleted successfully');
        queryClient.invalidateQueries({queryKey: [`/api/mission/${mission.id}`]});
        queryClient.invalidateQueries({queryKey: ["/api/missions"]});
        router.push('/missions');
        close();
      }
    }
  });
  const [confirmText, setConfirmText] = useState("");

  function handleDelete() {
    mutate({id: mission.id as number});
  }

  return (
    <>
      <TextField fullWidth variant="outlined"
                 id="confirmText" label={`Type mission name "${mission.name}" to confirm`}
                 placeholder={mission.name as string} margin="normal"
                 disabled={isPending}
                 value={confirmText} onChange={e => setConfirmText(e.target.value)}
      />

      {error && <FormError>{error.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={isPending}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDelete}
                disabled={isPending || confirmText !== mission.name}>
          {isPending ? <LoadingSpinnerSm/> : 'Delete'}
        </Button>
      </DialogActions>
    </>
  );
}