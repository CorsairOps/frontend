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
import {FormEvent, useEffect, useState} from "react";
import {mapBadRequestToErrorsObject} from "@/lib/api/util/api.util";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import {useQueryClient} from "@tanstack/react-query";

export default function EditAssetDialog({asset}: {
  asset: AssetResponse;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [assetRequest, setAssetRequest] = useState<AssetRequest>({
    name: asset.name ?? "",
    type: asset.type ?? "AIRCRAFT",
    status: asset.status ?? "INACTIVE",
    latitude: asset.latitude ?? 0,
    longitude: asset.longitude ?? 0,
  });

  const defaultErrors = {
    name: "",
    type: "",
    status: "",
    latitude: "",
    longitude: ""
  };

  const [errors, setErrors] = useState(defaultErrors);

  const {mutate, isPending, error} = useUpdateAsset({
    mutation: {
      onSuccess: async (data: AssetResponse) => {
        console.log("Asset updated successfully:", data);
        await queryClient.setQueryData(['asset', asset.id], data);
        await queryClient.invalidateQueries({queryKey: ['assetLocations', asset.id]});
        setOpen(false);
      },
      onError: (error) => {
        console.error("Error updating asset:", error);
        setErrors(mapBadRequestToErrorsObject(error.data, Object.keys(errors)) as typeof errors);
      }
    }
  });

  useEffect(() => {
    setErrors(defaultErrors);
  }, [asset]);


  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate({id: asset.id as string, data: assetRequest});
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit Asset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Edit Asset - {asset.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit asset details.
          </DialogContentText>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 w-full">
            <TextField autoFocus required id="name" label="Asset Name" fullWidth variant="standard"
                       value={assetRequest.name}
                       onChange={(e) => setAssetRequest({
                         ...assetRequest,
                         name: e.target.value
                       })}
                       error={errors.name !== ""}
                       helperText={errors.name}
            />

            <Box sx={{display: 'flex', gap: 2, mt: 2}}>
              <TextField autoFocus required id="type" label="Asset Type" fullWidth variant="standard"
                         select
                         slotProps={{select: {native: true}}}
                         value={assetRequest.type}
                         onChange={(e) => setAssetRequest({
                           ...assetRequest,
                           type: e.target.value as AssetRequestType
                         })}
                         error={errors.type !== ""}
                         helperText={errors.type}
              >
                {Object.values(AssetRequestType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </TextField>

              <TextField autoFocus required id="status" label="Asset Status" fullWidth variant="standard"
                         select
                         slotProps={{select: {native: true}}}
                         value={assetRequest.status}
                         onChange={(e) => setAssetRequest({
                           ...assetRequest,
                           status: e.target.value as AssetRequestStatus
                         })}
                         error={errors.status !== ""}
                         helperText={errors.status}
              >
                {Object.values(AssetRequestStatus).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </TextField>
            </Box>

            <Box sx={{display: 'flex', gap: 2, mt: 2}}>
              <TextField autoFocus required id="longitude" label="Asset Longitutde" fullWidth variant="standard"
                         type="number"
                         value={assetRequest.longitude}
                         onChange={(e) => setAssetRequest({
                           ...assetRequest,
                           longitude: parseFloat(e.target.value)
                         })}
                         error={errors.longitude !== ""}
                         helperText={errors.longitude}
              />
              <TextField autoFocus required id="latitude" label="Asset Latitude" fullWidth variant="standard"
                         type="number"
                         value={assetRequest.latitude}
                         onChange={(e) => setAssetRequest({
                           ...assetRequest,
                           latitude: parseFloat(e.target.value)
                         })}
                         error={errors.latitude !== ""}
                         helperText={errors.latitude}
              />
            </Box>
            {error && (
              <FormError>
                {error.message}
              </FormError>
            )}
            <DialogActions>
              <Button onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={isPending}>
                {isPending ? <LoadingSpinnerSm/> : "Save Changes"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}