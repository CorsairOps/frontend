'use client';
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import AdbIcon from '@mui/icons-material/Adb';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {useSession} from "next-auth/react";
import LoginBtn from "@/components/LoginBtn";


type Page = {
  name: string;
  href: string;
}

const pages: Page[] = [
  {name: "Dashboard", href: "/dashboard"},
  {name: "Assets", href: "/assets"},
  {name: "Missions", href: "/missions"},
  {name: "Users", href: "/users"},
];

const settings: Page[] = [
  {name: "Profile", href: "/profile"},
  {name: "Logout", href: "/logout"},
];


export default function Navbar() {

  const {data: session} = useSession();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" color="default" className="backdrop-blur-xl">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              color: "inherit",
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            CorsairOps
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon/>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left"
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {xs: 'block', md: 'none'}
              }}
            >
              {pages.map((page) => (
                <Link key={page.name} href={page.href} onClick={handleCloseNavMenu}>
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Typography sx={{textAlign: 'center'}}>{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'flex', md: 'none'},
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CorsairOps
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map((page) => (
              <Link key={page.name} href={page.href} onClick={handleCloseNavMenu}>
                <Button sx={{my: 2, color: 'inherit', display: 'block'}}>
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {session ? <UserSettings/> : <LoginBtn />}
        </Toolbar>

      </Container>
    </AppBar>
  )
}

function UserSettings() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open Settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          <Avatar alt="User Avatar" src="default-avatar.png"/>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{mt: '45px'}}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <Link key={setting.name} href={setting.href} onClick={handleCloseUserMenu}>
            <MenuItem>
              <Typography sx={{textAlign: 'center'}}>{setting.name}</Typography>
            </MenuItem>
          </Link>
        ))}

      </Menu>
    </Box>
  )
}