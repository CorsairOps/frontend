"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useSession} from "next-auth/react";
import {useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {
  MissionLogRequest,
  MissionResponse,
  useCreateMissionLog
} from "@/lib/api/services/missionServiceAPI";
import TextField from "@mui/material/TextField";
import {useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {missionLogSchema} from "@/features/mission/missionSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export default function AddMissionLogDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER" || "OPERATOR")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Mission Log
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Assign user to {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a Mission Log
          </DialogContentText>

          <AddMissionLogForm mission={mission} close={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddMissionLogForm({mission, close}: { mission: MissionResponse, close: () => void }) {
  type MissionLogForm = z.infer<typeof missionLogSchema>;
  const queryClient = useQueryClient();
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(missionLogSchema),
    defaultValues: {entry: ""}
  });
  const {mutate, isPending, error} = useCreateMissionLog({
    mutation: {
      onSuccess: async (data) => {
        console.log("Mission log created", data);
        queryClient.setQueryData([`/api/missions/${mission.id}/logs`], (prev) => {
          if (Array.isArray(prev)) {
            return [data, ...prev]
          }
        });
        close();
      }
    }
  });

  function onSubmit(data: MissionLogForm) {
    console.log("Submitting mission log", data);
    mutate({missionId: mission.id as number, data: data as MissionLogRequest});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField id="entry" label="Log Entry" fullWidth multiline rows={4}
                 error={!!errors.entry} helperText={errors.entry?.message}
                 {...register("entry")}
      />

      {error && <FormError>{error.message}</FormError>}

      <DialogActions>
        <Button onClick={close} disabled={isPending}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={isPending}>
          {isPending ? <LoadingSpinnerSm/> : "Add Log"}
        </Button>
      </DialogActions>
    </form>
  )
}