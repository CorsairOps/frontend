import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {Typography} from "@mui/material";

export type Links = { label: string; href: string }[];

export default function PageBreadcrumbs({links, current}: { links: Links, current: string }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) => (
        <Link key={index} color="inherit" href={link.href} underline="hover">
          {link.label}
        </Link>
      ))}
      <Typography sx={{color: 'text.primary'}}>{current}</Typography>
    </Breadcrumbs>

  )
}