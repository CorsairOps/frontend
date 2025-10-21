"use client";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FormError from "@/components/FormError";
import {LoadingSpinnerLg, LoadingSpinnerSm} from "@/components/loading-spinner";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {maintenanceRequestSchema} from "@/features/maintenance/maintenanceSchemas";
import {OrderRequest, OrderRequestStatus, useCreateOrder} from "@/lib/api/services/maintenanceServiceAPI";
import {useGetAllAssets} from "@/lib/api/services/assetServiceAPI";
import {useEffect, useState} from "react";

type MaintenanceForm = z.infer<typeof maintenanceRequestSchema>;

export default function CreateMaintenanceOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      assetId: '',
      priority: 3,
      status: OrderRequestStatus.PENDING,
      description: ''
    },
    resolver: zodResolver(maintenanceRequestSchema)
  });

  const {data: assets, isLoading: loadingAssets, error: assetsError} = useGetAllAssets();

  const {mutate: createOrder, isPending: isCreating, error: createError} = useCreateOrder({
    mutation: {
      onSuccess: async (data) => {
        console.log("Maintenance order created successfully:", data);
        await queryClient.invalidateQueries({queryKey: ['/api/maintenance/orders']});
        router.push(`/maintenance/${data.id}`);
      }
    }
  });

  const [assetSearch, setAssetSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const filteredAssets = assets?.filter(asset =>
    asset.name?.toLowerCase().includes(assetSearch.toLowerCase()) ||
    asset.id?.toLowerCase().includes(assetSearch.toLowerCase()) ||
    asset.type?.toLowerCase().includes(assetSearch.toLowerCase()) ||
    asset.status?.toLowerCase().includes(assetSearch.toLowerCase())
  ) || [];
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  useEffect(() => {
    if (selectedAssetId) {
      // Update the form value for assetId when an asset is selected
      const event = {
        target: {
          name: 'assetId',
          value: selectedAssetId
        }
      }
      register('assetId').onChange(event);
    } else {
      // Clear the form value for assetId when no asset is selected
      const event = {
        target: {
          name: 'assetId',
          value: ''
        }
      }
      register('assetId').onChange(event);
    }
  }, [selectedAssetId]);

  function onSubmit(data: MaintenanceForm) {
    console.log("Submitting create maintenance order request:", data);
    createOrder({data: data as OrderRequest});
  }

  if (loadingAssets) {
    return <LoadingSpinnerLg/>;
  }

  if (assetsError || !assets) {
    return <FormError>{assetsError?.message}</FormError>;
  }

  return (
    <ValidateRolesPage validRoles={['ADMIN', 'PLANNER']}>
      <div className="pt-24">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Maintenance Orders", href: "/maintenance"}]} current={"Create Order"}/>
          <Container maxWidth="md" component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box>
              <Typography variant="h1" sx={{fontSize: "2.5rem", fontWeight: "600", textAlign: 'center'}}>
                Create Maintenance Order
              </Typography>
              <Typography variant="body1" sx={{textAlign: 'center'}}>
                Fill out the details below to create a new maintenance order.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <Box sx={{position: 'relative'}}>
                <TextField id="assetSearch" label="Asset" variant="outlined" fullWidth disabled={isCreating}
                           value={assetSearch} onChange={(e) => {
                  setAssetSearch(e.target.value)
                  setSelectedAssetId('');
                }}
                           placeholder="Search assets..."
                           onFocus={() => setSearchFocused(true)}
                           onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                           error={!!errors.assetId}
                           helperText={errors.assetId?.message}
                />
                {searchFocused && assetSearch && (
                  <Box sx={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    maxHeight: 200,
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 1,
                  }}
                  >
                    {filteredAssets.map(asset => (
                      <Box key={asset.id} onClick={() => {
                        setSelectedAssetId(asset.id as string);
                        setSearchFocused(false);
                        setAssetSearch(asset.id || '');
                      }}>
                        <Typography variant="h3" fontSize="1rem" sx={{p: 1, cursor: 'pointer'}}>
                          {asset.name} (ID: {asset.id})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{display: 'flex', gap: 2}}>
                <TextField id="priority" label="Priority (1-5)" variant="outlined" fullWidth type="number"
                           disabled={isCreating}
                           select slotProps={{select: {native: true}}}
                           {...register("priority", {valueAsNumber: true})} error={!!errors.priority}
                           helperText={errors.priority?.message}
                >
                  {[1, 2, 3, 4, 5].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </TextField>

                <TextField id="status" label="Status" variant="outlined" fullWidth disabled={isCreating}
                           select slotProps={{select: {native: true}}}
                           {...register("status")} error={!!errors.status} helperText={errors.status?.message}
                >
                  {Object.values(OrderRequestStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </TextField>
              </Box>

              <TextField id="description" label="Order Description" variant="outlined" fullWidth
                         disabled={isCreating}
                         multiline
                         maxRows={15}
                         {...register("description")} error={!!errors.description}
                         helperText={errors.description?.message}
              />

              {createError && <FormError>{createError.message}</FormError>}

              <Button type="submit" variant="contained" color="primary" disabled={isCreating}>
                {isCreating ? <LoadingSpinnerSm/> : "Create Order"}
              </Button>
            </form>
          </Container>
        </Container>
      </div>
    </ValidateRolesPage>
  )
}