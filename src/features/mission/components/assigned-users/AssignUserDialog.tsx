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
import {MissionResponse, useAssignMissionToUser} from "@/lib/api/services/missionServiceAPI";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useQueryClient} from "@tanstack/react-query";
import {useGetAllUsers} from "@/lib/api/services/userServiceAPI";

export default function AssignUserDialog({mission}: { mission: MissionResponse }) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  // verify is planner or admin role
  if (!session || !session.user.roles.some(role => role === "ADMIN" || role === "PLANNER")) {
    return null;
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Assign User
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Assign user to {mission.name as string}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign a user to this mission.
          </DialogContentText>

          <AssignUserForm mission={mission} close={() => setOpen(false)}/>

        </DialogContent>
      </Dialog>
    </>
  )
}

function AssignUserForm({mission, close}: { mission: MissionResponse, close: () => void }) {
  const queryClient = useQueryClient();
  const {data: users, isLoading: loadingUsers, error: usersError} = useGetAllUsers();
  const {mutate: assignUser, isPending: assigningUser, error: assignUserError} = useAssignMissionToUser({
    mutation: {
      onSuccess: async () => {
        console.log('User assigned successfully');
        await queryClient.invalidateQueries({queryKey: [`/api/missions/assigned-missions/users/${mission.id}`]})
        close();
      }
    }
  });
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Handle filtering assets based on search input
    if (searchInput.trim() === "") {
      setFilteredUsers(users || []);
    } else {
      // Filter
      const filtered = (users || []).filter(user =>
        user.lastName?.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.id?.toLowerCase().includes(searchInput.toLowerCase()));
      setFilteredUsers(filtered);
    }
  }, [users, searchInput]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!userId) return;
    assignUser({params: {missionId: mission.id as number, userId: userId}});
  }

  if (loadingUsers) {
    return <LoadingSpinnerSm/>;
  }

  if (usersError) {
    return <FormError>{usersError.message}</FormError>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField id="search-users" label="Search Users" placeholder="Search by last name, first name, email or ID"
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
            </Box>
          ))}
        </Box>
      )}
      {assignUserError && <FormError>{assignUserError.message}</FormError>}
      <DialogActions>
        <Button onClick={close} disabled={assigningUser}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={assigningUser || !userId}>
          {assigningUser ? <LoadingSpinnerSm/> : "Assign User"}
        </Button>
      </DialogActions>
    </form>
  )
}