"use client";
import {AssetResponse, useGetAllAssets} from "@/lib/api/services/assetServiceAPI";
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import {useEffect, useState} from "react";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {useRouter} from "next/navigation";

const columns: GridColDef[] = [
  {field: 'name', headerName: 'Name', width: 300},
  {field: 'type', headerName: 'Type', width: 300},
  {field: 'status', headerName: 'Status', width: 300},
  {
    field: 'location', headerName: 'Location', width: 400,
    valueGetter: (value: never, row: AssetResponse) => `${row.latitude || ''}, ${row.longitude || ''}`,
  },
];

const paginationModel = {page: 0, pageSize: 50};

export default function AssetsTable() {
  const [filteredAssets, setFilteredAssets] = useState<AssetResponse[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const {data: assets, isLoading: loadingAssets, error: assetsError} = useGetAllAssets();

  const router = useRouter();

  useEffect(() => {
    if (assets) {
      setFilteredAssets(filterAssets(assets, searchInput));
    } else {
      setFilteredAssets([]);
    }
  }, [assets, searchInput]);

  function filterAssets(assets: AssetResponse[], query: string): AssetResponse[] {
    if (!query) {
      return assets;
    }
    const lowerCaseQuery = query.toLowerCase();
    return assets.filter(asset => {
      if (asset.name && asset.name.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      if (asset.type && asset.type.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      if (asset.status && asset.status.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      if (asset.latitude && asset.longitude) {
        const locationString = `${asset.latitude}, ${asset.longitude}`.toLowerCase();
        if (locationString.includes(lowerCaseQuery)) {
          return true;
        }
      }
    });
  }

  if (loadingAssets) {
    return <LoadingSpinnerLg/>;
  }

  if (assetsError) {
    return (
      <Typography variant="body1" color="error">
        {`Error loading assets: ${assetsError.message}`}
      </Typography>
    )
  }

  return (
    <Box className="flex flex-col gap-4">

      {/* Search Bar */}
      <TextField id="search-assets" label="Search Assets" variant="filled" fullWidth
                 placeholder="Search by name, type, status, location..."
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

      {/* Assets Table */}
      <DataGrid
        rows={filteredAssets}
        columns={columns}
        initialState={{ pagination: { paginationModel }}}
        pageSizeOptions={[25, 50, 100, 250]}
        onRowClick={(row) => router.push(`/assets/${row.id}`)}
        sx={{border: 0}}
      />
    </Box>
  )
}