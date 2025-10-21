"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import {useState} from "react";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import {useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {
  OrderNoteRequest,
  OrderNoteResponse,
  OrderResponse, useAddNote,
} from "@/lib/api/services/maintenanceServiceAPI";
import {orderNoteRequestSchema} from "@/features/maintenance/maintenanceSchemas";

export default function AddOrderNoteDialog({order}: { order: OrderResponse }) {
  const {data: session} = useSession();

  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER" || role === "TECHNICIAN")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Note
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Note
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add note to order #{order.id}
          </DialogContentText>
          <AddNoteForm order={order} close={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddNoteForm({order, close}: {
  order: OrderResponse;
  close: () => void;
}) {
  type OrderForm = z.infer<typeof orderNoteRequestSchema>;
  const queryClient = useQueryClient();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(orderNoteRequestSchema),
    defaultValues: {
      note: ""
    }
  });

  const {mutate, isPending, error} = useAddNote({
    mutation: {
      onSuccess: async (data: OrderNoteResponse) => {
        console.log("Order note added successfully:", data);
        queryClient.setQueryData([`/api/maintenance/orders/${order.id}/notes`], (oldData: OrderNoteResponse[] | undefined) => {
          return oldData ? [data, ...oldData] : [data];
        });
        close();
      }
    }
  });

  function onSubmit(data: OrderForm) {
    console.log("Submitting add note request:", data);
    mutate({
      orderId: order.id as number,
      data: data as OrderNoteRequest
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full" noValidate>
      <TextField id="note" label="Note" multiline minRows={4} fullWidth
                 {...register("note")}
                 error={!!errors.note}
                 helperText={errors.note ? errors.note.message : ""}
                 disabled={isPending}
      />

      {error && <FormError>{error.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={isPending}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={isPending}>
          {isPending ? <LoadingSpinnerSm/> : "Add Note"}
        </Button>
      </DialogActions>
    </form>
  )
}