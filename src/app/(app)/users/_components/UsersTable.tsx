"use client";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useGetAllUsers, User} from "@/lib/api/services/userServiceAPI";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 300},
  {field: 'firstName', headerName: 'First Name', width: 150},
  {field: 'lastName', headerName: 'Last Name', width: 150},
  {field: 'email', headerName: 'Email', width: 250},
  {
    field: 'roles', headerName: 'Roles', width: 200,
    valueGetter: (value: never, row: User) => `${row.roles?.join(", ") ?? "N/A"}`
  },
  {field: "createdTimestamp", headerName: "Created At", width: 200,
    valueGetter: (value: never, row: User) => new Date(row.createdTimestamp as number).toLocaleString()
  },
  {field: "enabled", headerName: "Account Enabled", width: 130,
    valueGetter: (value: never, row: User) => row.enabled ? "Yes" : "No"
  }
];

const paginationModel = {page: 0, pageSize: 50};

export default function UsersTable() {
  const router = useRouter();
  const {data: users, isLoading: loadingUsers, error: usersError} = useGetAllUsers();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (users) {
      setFilteredUsers(filterUsers(users, searchInput));
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchInput]);

  function filterUsers(users: User[], query: string): User[] {
    if (!query) {
      return users;
    }
    const lowerCaseQuery = query.toLowerCase();
    return users.filter(user =>
      user.id?.toLowerCase().includes(lowerCaseQuery) ||
      user.firstName?.toString().toLowerCase().includes(lowerCaseQuery) ||
      user.lastName?.toLowerCase().includes(lowerCaseQuery) ||
      user.email?.toLowerCase().includes(lowerCaseQuery) ||
      user.roles?.some(role => role.toLowerCase().includes(lowerCaseQuery))
    );
  }

  if (loadingUsers) {
    return <LoadingSpinnerLg/>;
  }

  if (usersError) {
    return (
      <Typography variant="body1" color="error">
        {`Error loading users: ${usersError.message}`}
      </Typography>
    )
  }

  return (
    <Box className="flex flex-col gap-4">

      {/* Search Bar */}
      <TextField id="search-users" label="Search Users" variant="filled" fullWidth
                 placeholder="Search by id, first name, last name, email, roles..."
                 value={searchInput}
                 onChange={(e) => setSearchInput(e.target.value)}
                 slotProps={{
                   input: {
                     startAdornment: (
                       <InputAdornment position="start">
                         <SearchRounded/>
                       </InputAdornment>
                     ),
                   },
                 }}
      />

      {/* Users Table */}
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        initialState={{pagination: {paginationModel}}}
        pageSizeOptions={[25, 50, 100, 250]}
        onRowClick={(row) => router.push(`/users/${row.id}`)}
        sx={{border: 0}}
      />
    </Box>

  )
}