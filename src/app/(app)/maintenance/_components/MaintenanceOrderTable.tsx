"use client";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {OrderResponse, useGetAllOrders, User} from "@/lib/api/services/maintenanceServiceAPI";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 100},
  {field: 'asset.name', headerName: 'Asset', width: 200,
    valueGetter: (value: never, row: OrderResponse) => row.asset?.name ? row.asset.name : row.asset?.id ?? "N/A"
  },
  {field: 'status', headerName: 'Status', width: 150},
  {field: 'priority', headerName: 'Priority', width: 100},
  {
    field: 'placedBy', headerName: 'Placed By', width: 200,
    valueGetter: (value: never, row: OrderResponse) => `${formatName(row.placedBy)}`
  },
  {
    field: 'completedBy', headerName: 'Completed By', width: 200,
    valueGetter: (value: never, row: OrderResponse) => `${formatName(row.completedBy)}`
  },
  {field: 'createdAt', headerName: 'Created At', width: 200}
];

const paginationModel = {page: 0, pageSize: 50};

function formatName(user: User | undefined) {
  if (!user) return "N/A";
  if (!user.lastName && !user.firstName) return user.id ?? "N/A";
  return `${user.lastName}, ${user.firstName}`;
}

export default function MissionsTable() {
  const router = useRouter();
  const {data: orders, isLoading: loadingOrders, error: ordersError} = useGetAllOrders();

  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (orders) {
      setFilteredOrders(filterOrders(orders, searchInput));
    } else {
      setFilteredOrders([]);
    }
  }, [orders, searchInput]);

  function filterOrders(orders: OrderResponse[], query: string): OrderResponse[] {
    if (!query) {
      return orders;
    }
    const lowerCaseQuery = query.toLowerCase();
    return orders.filter(order =>
      order.id?.toString().toLowerCase().includes(lowerCaseQuery) ||
      order.asset?.name?.toLowerCase().includes(lowerCaseQuery) ||
      order.status?.toLowerCase().includes(lowerCaseQuery) ||
      order.placedBy?.lastName?.toLowerCase().includes(lowerCaseQuery) ||
      order.placedBy?.firstName?.toLowerCase().includes(lowerCaseQuery) ||
      order.completedBy?.lastName?.toLowerCase().includes(lowerCaseQuery) ||
      order.completedBy?.firstName?.toLowerCase().includes(lowerCaseQuery) ||
      order.createdAt?.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (loadingOrders) {
    return <LoadingSpinnerLg/>;
  }

  if (ordersError) {
    return (
      <Typography variant="body1" color="error">
        {`Error loading Orders: ${ordersError.message}`}
      </Typography>
    )
  }

  return (
    <Box className="flex flex-col gap-4">

      {/* Search Bar */}
      <TextField id="search-assets" label="Search Assets" variant="filled" fullWidth
                 placeholder="Search by id, asset name, status, placed by, copmleted by, create at..."
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

      {/* Missions Table */}
      <DataGrid
        rows={filteredOrders}
        columns={columns}
        initialState={{pagination: {paginationModel}}}
        pageSizeOptions={[25, 50, 100, 250]}
        onRowClick={(row) => router.push(`/maintenance/${row.id}`)}
        sx={{border: 0}}
      />
    </Box>

  )
}