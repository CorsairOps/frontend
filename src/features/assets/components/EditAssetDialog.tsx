"use client";
import {
  AssetRequest,
  AssetRequestStatus,
  AssetRequestType,
  AssetResponse, useUpdateAsset
} from "@/lib/api/services/assetServiceAPI";
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
import {assetRequestSchema} from "@/features/assets/assetSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";

export default function EditAssetDialog({asset}: { asset: AssetResponse }) {
  const {data: session} = useSession();

  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit Asset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Edit &#34;{asset.name}&#34;
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit asset details.
          </DialogContentText>
          <EditAssetForm asset={asset} close={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditAssetForm({asset, close}: {
  asset: AssetResponse;
  close: () => void;
}) {
  type AssetForm = z.infer<typeof assetRequestSchema>;
  const queryClient = useQueryClient();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(assetRequestSchema),
    defaultValues: {
      name: asset.name,
      type: asset.type,
      status: asset.status,
      latitude: asset.latitude,
      longitude: asset.longitude
    }
  });

  const {mutate, isPending, error} = useUpdateAsset({
    mutation: {
      onSuccess: async (data: AssetResponse) => {
        console.log("Asset updated successfully:", data);
        queryClient.setQueryData(['asset', asset.id], data);
        queryClient.invalidateQueries({queryKey: ['assetLocations', asset.id]});
        close();
      }
    }
  });

  function onSubmit(data: AssetForm) {
    console.log("Submitting update asset request:", data);
    mutate({id: asset.id as string, data: data as AssetRequest});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full" noValidate>
      <TextField autoFocus id="name" label="Asset Name" fullWidth variant="standard" disabled={isPending}
                 {...register("name")} error={!!errors.name} helperText={errors.name?.message}
      />

      <Box sx={{display: 'flex', gap: 2, mt: 2}}>
        <TextField autoFocus id="type" label="Asset Type" fullWidth variant="standard" disabled={isPending}
                   select slotProps={{select: {native: true}}}
                   {...register("type")} error={!!errors.type} helperText={errors.type?.message}
        >
          {Object.values(AssetRequestType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </TextField>

        <TextField autoFocus id="status" label="Asset Status" fullWidth variant="standard" disabled={isPending}
                   select slotProps={{select: {native: true}}}
                   {...register("status")} error={!!errors.status} helperText={errors.status?.message}
        >
          {Object.values(AssetRequestStatus).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </TextField>
      </Box>

      <Box sx={{display: 'flex', gap: 2, mt: 2}}>
        <TextField autoFocus id="latitude" label="Asset Latitude" fullWidth variant="standard"
                   disabled={isPending} type="number"
                   {...register("latitude")} error={!!errors.latitude} helperText={errors.latitude?.message}
        />
        <TextField autoFocus id="longitude" label="Asset Longitutde" fullWidth variant="standard"
                   disabled={isPending} type="number"
                   {...register("longitude")} error={!!errors.longitude} helperText={errors.longitude?.message}
        />
      </Box>
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