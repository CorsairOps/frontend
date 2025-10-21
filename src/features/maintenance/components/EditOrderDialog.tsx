"use client";
import {
  Box,
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
  OrderRequest,
  OrderRequestStatus,
  OrderResponse,
  useUpdateOrder
} from "@/lib/api/services/maintenanceServiceAPI";
import {maintenanceRequestSchema} from "@/features/maintenance/maintenanceSchemas";

export default function EditOrderDialog({order}: { order: OrderResponse }) {
  const {data: session} = useSession();

  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit Order Details
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Order &#34;{order.id}&#34;
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit order details.
          </DialogContentText>
          <EditOrderForm order={order} close={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditOrderForm({order, close}: {
  order: OrderResponse;
  close: () => void;
}) {
  type OrderForm = z.infer<typeof maintenanceRequestSchema>;
  const queryClient = useQueryClient();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      assetId: order.asset?.id,
      description: order.description,
      status: order.status,
      priority: order.priority
    }
  });

  const {mutate, isPending, error} = useUpdateOrder({
    mutation: {
      onSuccess: async (data: OrderResponse) => {
        console.log("Order updated successfully:", data);
        queryClient.setQueryData([`/api/maintenance/orders/${order.id}`], data);
        await queryClient.invalidateQueries({queryKey: ['/api/maintenance/orders']});
        close();
      }
    }
  });

  function onSubmit(data: OrderForm) {
    console.log("Submitting update order request:", data);
    mutate({id: order.id as number, data: data as OrderRequest});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full" noValidate>
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField id="priority" label="Priority (1-5)" variant="outlined" fullWidth type="number"
                   disabled={isPending}
                   select slotProps={{select: {native: true}}}
                   {...register("priority", {valueAsNumber: true})} error={!!errors.priority}
                   helperText={errors.priority?.message}
        >
          {[1, 2, 3, 4, 5].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </TextField>

        <TextField id="status" label="Status" variant="outlined" fullWidth disabled={isPending}
                   select slotProps={{select: {native: true}}}
                   {...register("status")} error={!!errors.status} helperText={errors.status?.message}
        >
          {Object.values(OrderRequestStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </TextField>
      </Box>

      <TextField id="description" label="Order Description" variant="outlined" fullWidth
                 disabled={isPending}
                 multiline
                 maxRows={15}
                 {...register("description")} error={!!errors.description}
                 helperText={errors.description?.message}
      />

      {error && <FormError>{error.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={isPending}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={isPending}>
          {isPending ? <LoadingSpinnerSm/> : "Save Changes"}
        </Button>
      </DialogActions>
    </form>
  )
}