"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {LoadingSpinnerMd} from "@/components/loading-spinner";
import FormError from "@/components/FormError";
import {AirlineStops} from "@mui/icons-material";
import {useGetMissionCount} from "@/lib/api/services/missionServiceAPI";

export default function MissionCount() {

  const {data, isLoading, error} = useGetMissionCount();

  return (
    <Box component={Paper} sx={{p: 2, width: '100%'}}>
      <Typography variant="h2" gutterBottom
                  display="inline-flex" alignItems="center" gap={2} fontSize="1.5rem" fontWeight="bold"
      >
        <AirlineStops fontSize={"large"}/>
        Total Missions
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