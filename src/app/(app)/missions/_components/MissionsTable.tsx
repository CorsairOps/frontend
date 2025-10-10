"use client";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {MissionResponse, useGetAllMissions} from "@/lib/api/services/missionServiceAPI";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const columns: GridColDef[] = [
  {field: 'name', headerName: 'Name', width: 300},
  {field: 'priority', headerName: 'Priority', width: 100},
  {field: 'status', headerName: 'Status', width: 150},
  {field: 'startDate', headerName: 'Start', width: 150},
  {field: 'endDate', headerName: 'End', width: 150},
  {
    field: 'createdBy', headerName: 'Created By', width: 200,
    valueGetter: (value: never, row: MissionResponse) => `${row.createdBy?.lastName ?? "N/A"}, ${row.createdBy?.firstName ?? "N/A"}`
  }
];

const paginationModel = {page: 0, pageSize: 50};

export default function MissionsTable() {
  const router = useRouter();
  const {data: missions, isLoading: loadingMissions, error: missionsError} = useGetAllMissions();

  const [filteredMissions, setFilteredMissions] = useState<MissionResponse[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (missions) {
      setFilteredMissions(filterMissions(missions, searchInput));
    } else {
      setFilteredMissions([]);
    }
  }, [missions, searchInput]);

  function filterMissions(missions: MissionResponse[], query: string): MissionResponse[] {
    if (!query) {
      return missions;
    }
    const lowerCaseQuery = query.toLowerCase();
    return missions.filter(mission =>
      mission.name?.toLowerCase().includes(lowerCaseQuery) ||
      mission.priority?.toString().toLowerCase().includes(lowerCaseQuery) ||
      mission.status?.toLowerCase().includes(lowerCaseQuery) ||
      mission.startDate?.toLowerCase().includes(lowerCaseQuery) ||
      mission.endDate?.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (loadingMissions) {
    return <LoadingSpinnerLg/>;
  }

  if (missionsError) {
    return (
      <Typography variant="body1" color="error">
        {`Error loading missions: ${missionsError.message}`}
      </Typography>
    )
  }

  return (
    <Box className="flex flex-col gap-4">

      {/* Search Bar */}
      <TextField id="search-assets" label="Search Assets" variant="filled" fullWidth
                 placeholder="Search by name, priority, status, start, end..."
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
        rows={filteredMissions}
        columns={columns}
        initialState={{pagination: {paginationModel}}}
        pageSizeOptions={[25, 50, 100, 250]}
        onRowClick={(row) => router.push(`/missions/${row.id}`)}
        sx={{border: 0}}
      />
    </Box>

  )
}