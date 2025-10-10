"use client";
import {useGetAuthUser} from "@/lib/api/services/userServiceAPI";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

export default function ProfilePage() {

  const {data: authUser, isPending: isLoadingAuthUser, error: authUserError} = useGetAuthUser();

  if (isLoadingAuthUser) {
    return (
      <div className="pt-24 flex items-center justify-center">
        <LoadingSpinnerLg/>
      </div>
    );
  }

  if (authUserError) {
    return (
      <div className='pt-24 flex flex-col items-center justify-center'>
        <Typography variant="h1" sx={{
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          Failed to load user data.
        </Typography>
        <Typography variant="body1" sx={{color: 'error', mt: 2, textAlign: 'center'}}>
          {authUserError.message}
        </Typography>
      </div>
    );
  }

  if (authUser) {
    return (
      <div className="pt-24 p-8 w-full">
        <Container maxWidth="md">
          <Card sx={{ p: 2}}>
            <Typography variant="h1" sx={{fontSize: '2rem', mb: 2}}>
              Profile
            </Typography>
            <Typography variant="body1">ID{authUser.id}</Typography>
            <Typography variant="body1">Email: {authUser.email}</Typography>
            <Typography variant="body1">First Name: {authUser.firstName}</Typography>
            <Typography variant="body1">Last Name: {authUser.lastName}</Typography>
            {authUser.createdTimestamp && <Typography variant="body1">Created
                At: {new Date(authUser.createdTimestamp).toLocaleString()}</Typography>}
          </Card>


        </Container>
      </div>
    );
  }
  return null;
}