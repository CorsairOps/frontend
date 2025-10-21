"use client";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useSession} from "next-auth/react";
import {useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {
  OrderNoteResponse,
  useDeleteNote,
} from "@/lib/api/services/maintenanceServiceAPI";
import {useQueryClient} from "@tanstack/react-query";

export default function DeleteOrderNoteDialog({note}: { note: OrderNoteResponse }) {
  const queryClient = useQueryClient();
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  const {mutate, isPending, error} = useDeleteNote({
    mutation: {
      onSuccess: async () => {
        console.log('Note deleted successfully');
        await queryClient.invalidateQueries({queryKey: [`/api/maintenance/orders/${note.id}/notes`]});
        setOpen(false);
      }
    }
  });

  function handleDelete() {
    mutate({orderId: note.orderId as number, noteId: note.id as number});
  }

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => setOpen(true)} size="small">
        Delete Note
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Note {note.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? This action cannot be undone. All associated data will be
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