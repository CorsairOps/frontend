"use client";
import {Box, Breadcrumbs, Button, Container, FormControl, Link, Paper, TextField, Typography} from "@mui/material";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {FormEvent, useEffect, useState} from "react";
import {AssetRequest, AssetRequestStatus, AssetRequestType, useCreateAsset} from "@/lib/api/services/assetServiceAPI";
import {mapBadRequestToErrorsObject} from "@/lib/api/util/api.util";
import FormError from "@/components/FormError";
import {useRouter} from "next/navigation";

export default function CreateAssetPage() {
  const router = useRouter();

  const [assetRequest, setAssetRequest] = useState<AssetRequest>({
    name: "",
    type: "AIRCRAFT",
    status: "ACTIVE",
    latitude: 0,
    longitude: 0,
  });

  const defaultErrors = {
    name: "",
    type: "",
    status: "",
    latitude: "",
    longitude: ""
  }

  const [errors, setErrors] = useState(defaultErrors);

  const {mutate: createAsset, isPending: isCreating, error: createError, isError} = useCreateAsset({
    mutation: {
      onSuccess: async (data) => {
        console.log("Asset created successfully:", data);
        router.push(`/assets/${data.id}`);
      }
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("Submitting create asset request:", assetRequest);
    createAsset({data: assetRequest});
  }

  useEffect(() => {
    if (isError) {
      console.error("Error creating asset:", createError);
      setErrors(mapBadRequestToErrorsObject(createError.data, Object.keys(errors)) as typeof errors);
    } else {
      // Reset form on successful creation
      setErrors(defaultErrors)
    }
  }, [createError]);

  return (
    <ValidateRolesPage validRoles={['ADMIN', 'PLANNER']}>
      <div className="pt-24">
        <Container maxWidth="xl" sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/assets" underline="hover">
              Assets
            </Link>
            <Typography sx={{color: 'text.primary'}}>Create Asset</Typography>
          </Breadcrumbs>

          <Container maxWidth="md" component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box>
              <Typography variant="h1" sx={{fontSize: "2.5rem", fontWeight: "600", textAlign: 'center'}}>
                Create Asset
              </Typography>
              <Typography variant="body1" sx={{textAlign: 'center'}}>
                Fill out the details below to create a new asset.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>

              <FormControl error={isError} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {/* Name */}
                <TextField id="name" label="Asset Name" variant="outlined" fullWidth
                           value={assetRequest.name}
                           onChange={e => setAssetRequest(prev => ({...prev, name: e.target.value}))}
                           error={errors.name !== ""}
                           helperText={errors.name}
                           disabled={isCreating}
                />

                <Box sx={{display: 'flex', gap: 2, width: '100%'}}>

                  {/* Type */}
                  <TextField id="type" label="Asset Type" variant="outlined" fullWidth
                             select
                             slotProps={{select: {native: true}}}
                             value={assetRequest.type}
                             onChange={e => setAssetRequest(prev => ({
                               ...prev,
                               type: e.target.value as AssetRequest['type']
                             }))}
                             error={errors.type !== ""}
                             helperText={errors.type}
                             disabled={isCreating}
                  >
                    {Object.values(AssetRequestType).map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </TextField>

                  {/* Status */}
                  <TextField id="status" label="Asset Status" variant="outlined" fullWidth
                             select
                             slotProps={{select: {native: true}}}
                             value={assetRequest.status}
                             onChange={e => setAssetRequest(prev => ({
                               ...prev,
                               status: e.target.value as AssetRequest['status']
                             }))}
                             error={errors.status !== ""}
                             helperText={errors.status}
                             disabled={isCreating}
                  >
                    {Object.values(AssetRequestStatus).map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{display: 'flex', gap: 2, width: '100%'}}>
                  {/* Latitude */}
                  <TextField id="latitude" variant="outlined" label="Latitude" type="number" fullWidth
                             value={assetRequest.latitude}
                             onChange={e => setAssetRequest(prev => ({
                               ...prev,
                               latitude: parseFloat(e.target.value)
                             }))}
                             error={errors.latitude !== ""}
                             helperText={errors.latitude}
                             disabled={isCreating}
                  />

                  {/* Longitude */}
                  <TextField id="longitude" variant="outlined" label="Longitude" type="number" fullWidth
                             value={assetRequest.longitude}
                             onChange={e => setAssetRequest(prev => ({
                               ...prev,
                               longitude: parseFloat(e.target.value)
                             }))}
                             error={errors.longitude !== ""}
                             helperText={errors.longitude}
                             disabled={isCreating}
                  />
                </Box>

                {createError && createError.message && (
                  <FormError>{createError.message}</FormError>
                )}

                <Button type="submit" variant="contained" disabled={isCreating}>
                  Create Asset
                </Button>
              </FormControl>
            </form>


          </Container>
        </Container>
      </div>
    </ValidateRolesPage>
  )
}