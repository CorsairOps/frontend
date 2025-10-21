"use client";
import {OrderResponse, useGetNotes, User} from "@/lib/api/services/maintenanceServiceAPI";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {LoadingSpinnerSm} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import AddOrderNoteDialog from "@/features/maintenance/components/AddOrderNoteDialog";
import DeleteOrderNoteDialog from "@/features/maintenance/components/DeleteOrderNoteDialog";

export default function OrderNotes({order}: {
  order: OrderResponse;
}) {

  const {data: notes, isLoading: loadingNotes, error: notesError} = useGetNotes(order.id as number);

  function formatUserName(user: User | undefined) {
    return !user ?
      "Unknown User" :
      (user.firstName && user.lastName) ? `${user.lastName}, ${user.firstName}` :
        user.id;
  }

  return (
    <Box
      component={Paper}
      sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2}}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'},
        justifyContent: 'space-between',
        alignItems: {xs: 'flex-start', md: 'center'},
        gap: 1
      }}>
        <Typography variant="h2" fontSize="1.5rem" fontWeight="bold">
          Order Notes
        </Typography>
        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center'}}>
          <AddOrderNoteDialog order={order}/>
        </Box>
      </Box>
      {loadingNotes && <LoadingSpinnerSm/>}
      {notesError && <FormError>{notesError.message}</FormError>}
      {!notesError && notes && notes.length === 0 && (
        <Typography variant="body1">
          No notes available for this order.
        </Typography>
      )}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {!notesError && notes && notes.length > 0 && notes.map((note) => (
          <Box key={note.id}>
            <DeleteOrderNoteDialog note={note} />
            <Typography variant="h4" fontSize="1rem" color="textSecondary">
              {formatUserName(note.createdBy)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(note.createdAt as string).toLocaleString()}
            </Typography>
            <Typography variant="body1" flexWrap="wrap" width="100%">
              {note.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}