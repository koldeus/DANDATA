import React from "react";
import UserCard from "./Usercard";

export default function Sidebar({ user, theme, setActiveTab, activeTab }) {
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
    <aside className={`sidebar ${theme}_light-background`}>
      <UserCard user={user} theme={theme} />
      <ul className="nav-list">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className={activeTab === item.id ? "active link" : "link"}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
