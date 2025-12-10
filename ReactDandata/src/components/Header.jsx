import React, { useState } from "react";
import "./header.css";
import "../Pages/theme.css";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Boutton } from "./compte/Boutton";
import { Navbar } from "./compte/navbar";

export function Header({ theme }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const lightBackground = {
    'DarkTheme': "#360815",
    'NightTheme': "#15203c",
    'LightTheme': "#191a34",
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo Dandata" />
        <h2>
          Dan<span>Data</span>
        </h2>
      </div>

      {/* Navbar desktop */}
      <div className="navbar-desktop">
        <Navbar />
      </div>

      {/* Bouton desktop */}
      <div className="btn-connect-desktop">
        <Boutton />
      </div>

      {/* Menu burger mobile */}
      <div className="navbar-mobile">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ color: "#fff" }} />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              backgroundColor: lightBackground[theme],
              color: "#fff",
              width: 250,
            },
          }}
        >
          <List sx={{ margin: "12px 10px" }}>
            <ListItemButton component={Link} to="/" onClick={toggleDrawer(false)}>
              <ListItemText primary="Accueil" sx={{ color: "#fff", marginTop: "10px" }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/categories"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Catégories" sx={{ color: "#fff" }} />
            </ListItemButton>

            <ListItemButton onClick={toggleDrawer(false)}>
              <Boutton />
            </ListItemButton>
          </List>
        </Drawer>
      </div>
    </header>
  );
}
