import {
  MissionRequest,
  MissionRequestStatus,
  MissionResponse,
  useUpdateMission
} from "@/lib/api/services/missionServiceAPI";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import {useSession} from "next-auth/react";
import {useState} from "react";
import {z} from "zod";
import {missionRequestSchema} from "@/features/mission/missionSchemas";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, TextField} from "@mui/material";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";

export default function EditMissionDialog({mission}: {
  mission: MissionResponse;
}) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Edit Mission
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Edit &#34;{mission.name}&#34;
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit mission details.
          </DialogContentText>
          <EditMissionForm mission={mission} close={handleClose}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditMissionForm({mission, close}: {
  mission: MissionResponse;
  close: () => void;
}) {
  type MissionForm = z.infer<typeof missionRequestSchema>;
  const queryClient = useQueryClient();
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(missionRequestSchema),
    defaultValues: {
      name: mission.name || '',
      description: mission.description || '',
      priority: mission.priority || 3,
      status: mission.status || MissionRequestStatus.PENDING,
      startDate: mission.startDate || '',
      endDate: mission.endDate || ''
    }
  });
  const {mutate, isPending, error} = useUpdateMission({
    mutation: {
      onSuccess: async (data: MissionResponse) => {
        console.log("Mission updated successfully:", data);
        await queryClient.setQueryData([`/api/missions/${data.id}`], data);
        await queryClient.invalidateQueries({queryKey: ['/api/missions']});
        close();
      }
    }
  });

  function onSubmit(data: MissionForm) {
    console.log("Submitting mission data:", data);
    mutate({id: mission.id as number, data: data as MissionRequest});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full" noValidate>
      <TextField id="name" label="Mission Name" variant="outlined" fullWidth disabled={isPending}
                 {...register("name")} error={!!errors.name} helperText={errors.name?.message}
      />

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
          {Object.values(MissionRequestStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </TextField>
      </Box>

      <Box sx={{display: 'flex', gap: 2}}>
        <TextField id="startDate" label="Start Date" variant="outlined" fullWidth disabled={isPending}
                   type="date"
                   slotProps={{inputLabel: {shrink: true}}}
                   {...register("startDate")} error={!!errors.startDate}
                   helperText={errors.startDate?.message}
        />
        <TextField id="endDate" label="End Date (Optional)" variant="outlined" fullWidth disabled={isPending}
                   type="date"
                   slotProps={{inputLabel: {shrink: true}}}
                   {...register("endDate")} error={!!errors.endDate}
                   helperText={errors.endDate?.message}
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
  );
}