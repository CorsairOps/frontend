"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AssetsTable from "@/app/(app)/assets/_components/AssetsTable";
import {Button, Container} from "@mui/material";
import Link from "next/dist/client/link";

export default function AssetsPage() {

  return (
      <div className="pt-24">
        <Container maxWidth="xl" sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <Box>
            <Typography variant="h1" sx={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
            }}>
              Assets
            </Typography>
            <Typography variant="body1">
              View and manage assets.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', ml: 'auto'}}>
            <Link href="/assets/create">
              <Button variant="outlined">
                Create Asset
              </Button>
            </Link>
          </Box>
          <AssetsTable />
        </Container>
      </div>
  )
}