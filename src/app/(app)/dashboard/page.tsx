import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Dashboard() {
  return (
    <div className="pt-24">
      <Container maxWidth="xl">
        <Typography variant="h1" gutterBottom sx={{
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Dashboard
        </Typography>
      </Container>
    </div>
  )
}