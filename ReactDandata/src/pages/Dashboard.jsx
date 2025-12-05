import React, { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import BottomTabBar from "../components/Dashboard/BottomTabBar";
import { useUser } from "../hooks/useUser";

import DashboardHome from "../pages/Dashboard/UserPage";
import ArticlesPage from "../pages/Dashboard/ArticlesPage";
import UsersPage from "../pages/Dashboard/UserPage";
import FichierDataPage from "../pages/Dashboard/FichierData";
import AdministrationPage from "../pages/Dashboard/Administration";
import ThemePage from "../pages/Dashboard/ThemeSettingPage";
import ProfilePage from "../pages/Dashboard/ProfilePage";
import SousChargement from "../components/SousChargement/SousChargement";

import "./Dashboard.css";

export default function DashboardLayout({ theme }) {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  if (loading)
    return (
      <div className="dashboard-page">
        <Sidebar
          user={user}
          theme={theme}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <main className="main-content">
        </main>
        <BottomTabBar
          user={user}
          theme={theme}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
    );
  if (!user) return <div>Utilisateur non connecté</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ProfilePage theme={theme}/>;
      case "articles":
        return <ArticlesPage />;
      case "users":
        return <UsersPage />;
      case "FichierData":
        return <FichierDataPage />;
      case "Administration":
        return <AdministrationPage />;
      case "Theme":
        return <ThemePage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar
        user={user}
        theme={theme}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      <main className="main-content">{renderContent()}</main>
      <BottomTabBar
        user={user}
        theme={theme}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
    </div>
  );
}
