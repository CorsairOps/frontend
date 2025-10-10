import {MissionLogRequest, MissionLogResponse, useDeleteMissionLog} from "@/lib/api/services/missionServiceAPI";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import FormError from "@/components/FormError";

export default function DeleteMissionLogDialog({log}: {
  log: MissionLogResponse;
}) {
  const queryClient = useQueryClient();
  const {data: session} = useSession();
  const {mutate, isPending, error} = useDeleteMissionLog({
    mutation: {
      onSuccess: async () => {
        console.log("Mission log deleted");
        await queryClient.setQueryData([`/api/missions/${log.missionId}/logs`], (prev) => {
          if (Array.isArray(prev)) {
            return prev.filter(l => l.id !== log.id);
          }
        });
      }
    }
  });

  const [open, setOpen] = useState(false);

  function handleDelete() {
    console.log("Deleting mission log", log);
    mutate({missionId: log.missionId as number, logId: log.id as number});
  }

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)} size="small" sx={{borderRadius: '50%', width: '32px', height: '32px', minWidth: '32px'}}>
        <DeleteIcon fontSize="small" />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Delete mission log entry?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this mission log entry? This action cannot be undone.
          </DialogContentText>

          {error && <FormError>{error.message}</FormError>}

          <DialogActions>
            <Button variant="outlined" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={isPending}>
              {isPending ? <LoadingSpinnerSm /> : "Delete"}
            </Button>
          </DialogActions>

        </DialogContent>
      </Dialog>
    </>


  )
}