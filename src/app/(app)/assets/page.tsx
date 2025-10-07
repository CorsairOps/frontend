import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AssetsTable from "@/app/(app)/assets/_components/AssetsTable";

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
              fontWeight: 'bold'
            }}>
              Assets
            </Typography>
            <Typography variant="body1">
              View and manage assets.
            </Typography>
          </Box>

          <AssetsTable />
        </Container>
      </div>
  )
}