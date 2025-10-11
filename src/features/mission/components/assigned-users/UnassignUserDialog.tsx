"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import {useSession} from "next-auth/react";
import {FormEvent, useEffect, useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import FormError from "@/components/FormError";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import {
  MissionResponse,
  useGetUsersAssignedToMission, useUnassignMissionFromUser
} from "@/lib/api/services/missionServiceAPI";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useQueryClient} from "@tanstack/react-query";

export default function UnassignUserDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Unassign User
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Unassign user from {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unassign a user from this mission.
          </DialogContentText>

          <UnassignUserForm mission={mission} close={() => setOpen(false)}/>

        </DialogContent>
      </Dialog>
    </>
  )
}

function UnassignUserForm({mission, close}: { mission: MissionResponse, close: () => void }) {
  const queryClient = useQueryClient();
  const {
    data: assignedUsers,
    isLoading: loadingAssignedUsers,
    error: assignedUsersError
  } = useGetUsersAssignedToMission(mission.id as number);
  const {mutate: unassignUser, isPending: unassigning, error: unassignUserError} = useUnassignMissionFromUser({
    mutation: {
      onSuccess: async () => {
        console.log('User unassigned successfully');
        await queryClient.invalidateQueries({queryKey: [`/api/missions/assigned-missions/users/${mission.id}`]})
        close();
      }
    }
  });
  const [filteredUsers, setFilteredUsers] = useState(assignedUsers || []);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Handle filtering assets based on search input
    if (searchInput.trim() === "") {
      setFilteredUsers(assignedUsers || []);
    } else {
      // Filter
      const filtered = (assignedUsers || []).filter(user =>
        user.lastName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.roles?.some(role => role.toLowerCase().includes(searchInput.toLowerCase())));
      setFilteredUsers(filtered);
    }
  }, [assignedUsers, searchInput]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!userId) return;
    unassignUser({params: {missionId: mission.id as number, userId: userId}});
  }

  if (loadingAssignedUsers) {
    return <LoadingSpinnerSm/>;
  }

  if (assignedUsersError) {
    return <FormError>{assignedUsersError.message}</FormError>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField id="search-users" label="Search Users" placeholder="Search by last name, first name, email, roles or ID"
                 autoFocus
                 fullWidth variant="outlined"
                 value={searchInput}
                 onChange={(e) => setSearchInput(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No users found.</Typography>
      ) : (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 300, overflowY: 'auto'}}>
          {filteredUsers.map(user => (
            <Box key={user.id} sx={{
              p: 1,
              border: '1px solid #ccc',
              borderRadius: 1,
              backgroundColor: userId === user.id ? 'secondary.light' : 'transparent',
              cursor: 'pointer',
              '&:hover': {backgroundColor: 'secondary.light'},
              '&:active': {backgroundColor: 'secondary.main'}
            }}
                 onClick={() => setUserId(user.id as string)}
            >
              <Typography variant="h4" sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                {user.lastName}, {user.firstName}
              </Typography>
              <Typography variant="body1">
                <strong>ID:</strong> {user.id}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Roles:</strong> {user.roles?.join(', ')}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {unassignUserError && <FormError>{unassignUserError.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={unassigning}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={unassigning || !userId}>
          {unassigning ? <LoadingSpinnerSm/> : "Unassign User"}
        </Button>
      </DialogActions>
    </form>
  )
}