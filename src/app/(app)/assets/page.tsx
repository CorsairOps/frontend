import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AssetsPage() {

  return (
      <div className="pt-24">
        <Container maxWidth="xl">
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
        </Container>
      </div>
  )
}