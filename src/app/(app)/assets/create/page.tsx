"use client";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {AssetRequest, AssetRequestStatus, AssetRequestType, useCreateAsset} from "@/lib/api/services/assetServiceAPI";
import FormError from "@/components/FormError";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import {assetRequestSchema} from "@/features/assets/assetSchemas";
import {LoadingSpinnerSm} from "@/components/loading-spinner";

type AssetForm = z.infer<typeof assetRequestSchema>;

export default function CreateAssetPage() {
  const router = useRouter();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(assetRequestSchema),
    defaultValues: {
      type: AssetRequestType.AIRCRAFT,
      status: AssetRequestStatus.ACTIVE
    }
  });

  const {mutate: createAsset, isPending: isCreating, error: createError} = useCreateAsset({
    mutation: {
      onSuccess: async (data) => {
        console.log("Asset created successfully:", data);
        router.push(`/assets/${data.id}`);
      }
    }
  });

  function onSubmit(data: AssetForm) {
    console.log("Submitting create asset request:", data);
    createAsset({data: data as AssetRequest});
  }

  return (
    <ValidateRolesPage validRoles={['ADMIN', 'PLANNER']}>
      <div className="pt-24 p-8 w-full">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Assets", href: "/assets"}]} current={"Create Asset"}/>
          <Container maxWidth="md" component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box>
              <Typography variant="h1" sx={{fontSize: "2.5rem", fontWeight: "600", textAlign: 'center'}}>
                Create Asset
              </Typography>
              <Typography variant="body1" sx={{textAlign: 'center'}}>
                Fill out the details below to create a new asset.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              {/* Name */}
              <TextField id="name" label="Asset Name" variant="outlined" fullWidth disabled={isCreating}
                         {...register("name")} error={!!errors.name} helperText={errors.name?.message}

              />

              <Box sx={{display: 'flex', gap: 2, width: '100%'}}>

                {/* Type */}
                <TextField id="type" label="Asset Type" variant="outlined" fullWidth disabled={isCreating}
                           select slotProps={{select: {native: true}}}
                           {...register("type")} error={!!errors.type} helperText={errors.type?.message}
                >
                  {Object.values(AssetRequestType).map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </TextField>

                {/* Status */}
                <TextField id="status" label="Asset Status" variant="outlined" fullWidth disabled={isCreating}
                           select slotProps={{select: {native: true}}}
                           {...register("status")} error={!!errors.status} helperText={errors.status?.message}
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
                           disabled={isCreating}
                           {...register("latitude")} error={!!errors.latitude} helperText={errors.latitude?.message}
                />

                {/* Longitude */}
                <TextField id="longitude" variant="outlined" label="Longitude" type="number" fullWidth
                           disabled={isCreating}
                           {...register("longitude")} error={!!errors.longitude} helperText={errors.longitude?.message}
                />
              </Box>

              {createError && createError.message && (
                <FormError>{createError.message}</FormError>
              )}

              <Button type="submit" variant="contained" disabled={isCreating}>
                {isCreating ? <LoadingSpinnerSm/> : "Create Asset"}
              </Button>
            </form>
          </Container>
        </Container>
      </div>
    </ValidateRolesPage>
  )
}