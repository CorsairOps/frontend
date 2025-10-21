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
import {OrderResponse, useDeleteOrder} from "@/lib/api/services/maintenanceServiceAPI";
import {useQueryClient} from "@tanstack/react-query";

export default function DeleteOrderDialog({order}: { order: OrderResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  const {mutate, isPending, error} = useDeleteOrder({
    mutation: {
      onSuccess: async () => {
        console.log('Order deleted successfully');
        await queryClient.invalidateQueries({queryKey: ['/api/maintenance/orders']});
        router.push('/maintenance');
        setOpen(false);
      }
    }
  });

  function handleDelete() {
    mutate({id: order.id as number });
  }

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => setOpen(true)}>
        Delete Order
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Order {order.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone. All associated data will be
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