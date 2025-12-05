import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

const ICONS = {
  dashboard: <HomeIcon />,
  articles: <ArticleIcon />,
  Administration: <SettingsIcon />,
  Theme: <SettingsIcon />,
  FichierData: <SettingsIcon />,
};

export default function BottomTabBar({ user, theme, setActiveTab, activeTab }) {
  const NAV_ITEMS = [
    {
      id: "dashboard",
      label: "Dashboard",
      roles: ["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_AUTHOR", "ROLE_SUBSCRIBER"],
    },
    { id: "articles", label: "Articles", roles: ["ROLE_ADMIN", "ROLE_EDITOR"] },
    { id: "FichierData", label: "FichierData", roles: ["ROLE_ADMIN"] },
    { id: "Administration", label: "Administration", roles: ["ROLE_ADMIN"] },
    { id: "Theme", label: "Theme", roles: ["ROLE_ADMIN"] },
  ];

  const filteredItems = NAV_ITEMS.filter((item) =>
    (user?.roles || []).some((role) => item.roles.includes(role))
  );

  return (
    <nav className={`bottom-tab-bar ${theme}_light-background`}>
      {filteredItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="icon">{ICONS[item.id]}</div>
            <div className="label">{item.label}</div>
          </div>
        );
      })}  
    </nav>
  );
}
