"use client";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {missionRequestSchema} from "@/features/mission/missionSchemas";
import {useForm} from "react-hook-form";
import {MissionRequestStatus, useCreateMission, MissionRequest} from "@/lib/api/services/missionServiceAPI";
import {zodResolver} from "@hookform/resolvers/zod";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";

type MissionForm = z.infer<typeof missionRequestSchema>;

export default function CreateMissionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      name: '',
      priority: 3,
      status: MissionRequestStatus.PENDING,
      startDate: '',
      endDate: undefined,
      description: ''
    },
    resolver: zodResolver(missionRequestSchema)
  });

  const {mutate: createMission, isPending: isCreating, error: createError} = useCreateMission({
    mutation: {
      onSuccess: async (data) => {
        console.log("Mission created successfully:", data);
        queryClient.invalidateQueries({queryKey: ['/api/missions']});
        router.push(`/missions/${data.id}`);
      }
    }
  });

  function onSubmit(data: MissionForm) {
    console.log("Submitting create mission request:", data);
    createMission({data: data as MissionRequest});
  }

  return (
    <ValidateRolesPage validRoles={['ADMIN', 'PLANNER']}>
      <div className="pt-24">
        <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <PageBreadcrumbs links={[{label: "Missions", href: "/missions"}]} current={"Create Mission"}/>
          <Container maxWidth="md" component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box>
              <Typography variant="h1" sx={{fontSize: "2.5rem", fontWeight: "600", textAlign: 'center'}}>
                Create Mission
              </Typography>
              <Typography variant="body1" sx={{textAlign: 'center'}}>
                Fill out the details below to create a new mission.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <TextField id="name" label="Mission Name" variant="outlined" fullWidth disabled={isCreating}
                         {...register("name")} error={!!errors.name} helperText={errors.name?.message}
              />

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
                  {Object.values(MissionRequestStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </TextField>
              </Box>

              <Box sx={{display: 'flex', gap: 2}}>
                <TextField id="startDate" label="Start Date" variant="outlined" fullWidth disabled={isCreating}
                           type="date"
                           slotProps={{inputLabel: {shrink: true}}}
                           {...register("startDate")} error={!!errors.startDate}
                           helperText={errors.startDate?.message}
                />
                <TextField id="endDate" label="End Date (Optional)" variant="outlined" fullWidth disabled={isCreating}
                           type="date"
                           slotProps={{inputLabel: {shrink: true}}}
                           {...register("endDate")} error={!!errors.endDate}
                           helperText={errors.endDate?.message}
                />
              </Box>
              <TextField id="description" label="Mission Description" variant="outlined" fullWidth disabled={isCreating}
                         multiline
                         maxRows={15}
                         {...register("description")} error={!!errors.description} helperText={errors.description?.message}
              />

              {createError && <FormError>{createError.message}</FormError>}

              <Button type="submit" variant="contained" color="primary" disabled={isCreating}>
                {isCreating ? <LoadingSpinnerSm /> : "Create Mission"}
              </Button>
            </form>
          </Container>
        </Container>
      </div>
    </ValidateRolesPage>
  )
}