import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function ViewAndManagePanel({label, description, href, iconNode}: {
  label: string;
  description: string;
  href: string;
  iconNode: React.ReactNode;
}) {
  return (
    <Box component={Paper} width="100%" display='flex' flexDirection="column" gap={2} p={2}>
      <Typography variant="h2" gutterBottom fontSize="1.5rem" fontWeight="bold" display="inline-flex" alignItems="center" gap={2}>
        {iconNode}
        {label}
      </Typography>
      <Typography variant="body1" fontSize='1rem' color="textSecondary">
        {description}
      </Typography>
      <Link href={href}>
        <Button variant="outlined" color="primary">
          {label}
        </Button>
      </Link>
    </Box>
  )
}