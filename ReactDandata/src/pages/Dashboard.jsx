import React, { useEffect, useState } from "react";
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
import Categories from "./Dashboard/GestionCategorie";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

export default function DashboardLayout({ theme }) {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate(); 

 
  useEffect(() => {
    if (!loading && !user) {
      navigate("/")
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="dashboard-page">
        <Sidebar
          user={user}
          theme={theme}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <main className="main-content"></main>
        <BottomTabBar
          user={user}
          theme={theme}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ProfilePage theme={theme} />;
      case "articles":
        return <ArticlesPage theme={theme} />;
      case "users":
        return <UsersPage theme={theme} />;
      case "FichierData":
        return <FichierDataPage theme={theme} />;
      case "Administration":
        return <AdministrationPage theme={theme} />;
      case "Theme":
        return <ThemePage theme={theme} />;
      case "categories":
        return <Categories theme={theme} />;
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
