"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {useGetAssetCount} from "@/lib/api/services/assetServiceAPI";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import {DirectionsBoatFilled} from "@mui/icons-material";

export default function AssetsCount() {

  const {data, isLoading, error} = useGetAssetCount();

  return (
    <Box component={Paper} sx={{p: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
      <Typography variant="h2" gutterBottom
                  display="inline-flex" alignItems="center" gap={2} fontSize="1.5rem" fontWeight="bold"
      >
        <DirectionsBoatFilled fontSize={"large"}/>
        Total Assets
      </Typography>
      {isLoading && <LoadingSpinnerMd/>}
      {error && <FormError>{error.message}</FormError>}
      {data && (
        <Typography variant="body1" fontSize='1.75rem'>
          {data}
        </Typography>
      )}
    </Box>
  )
}