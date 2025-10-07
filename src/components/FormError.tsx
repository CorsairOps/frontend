import {ReactNode} from "react";
import {Typography} from "@mui/material";

export default function FormError({children}: {children: ReactNode}) {
  return (
    <Typography color="error" variant="body2" sx={{ textAlign: 'center'}}>
      {children}
    </Typography>
  )
}