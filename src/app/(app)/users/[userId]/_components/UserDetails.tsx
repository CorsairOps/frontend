
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {User} from '@/lib/api/services/userServiceAPI'

export default function UserDetails({user}: {user: User}) {
  return (
    <Box component={Paper} sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 1}}>
      <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold'}}>
        User Details
      </Typography>
      <Typography variant="body1">
        <strong>User ID:</strong> {user.id}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user.email}
      </Typography>
      <Typography variant="body1">
        <strong>First Name:</strong> {user.firstName}
      </Typography>
      <Typography variant="body1">
        <strong>Last Name:</strong> {user.lastName}
      </Typography>
      <Typography variant="body1">
        <strong>Roles:</strong> {user.roles?.join(", ") || "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Created At:</strong> {new Date(user.createdTimestamp as number).toLocaleString()}
      </Typography>
      <Typography variant="body1">
        <strong>Account Enabled: </strong>
        <Typography variant="body1" component="span" color={user.enabled ? 'success' : 'error'}>
          {user.enabled ? 'Yes' : 'No'}
        </Typography>
      </Typography>
    </Box>
  )
}