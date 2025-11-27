import React, { useState, useEffect } from "react";
import "./header.css";
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

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <header className="header">
      <div className="logo">
        <img src="public/images/logo.png" alt="Logo Dandata" />
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

      {/* Menu burger mobile/tablette */}
      <div className="navbar-mobile">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ color: "#ffffffff" }} />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              backgroundColor: "#23050E",
              color: "#fff",
              width: 250,
            },
          }}
        >
          <List>
            <ListItemButton
              component={Link}
              to="/"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Accueil" sx={{ color: "#fff" }} />
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
