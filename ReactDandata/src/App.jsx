import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageLoader from "./components/chargement/PageLoader";
import { Accueil } from "./pages/Accueil";
import { Categories } from "./pages/Categories";
import Log_SignIn from "./pages/Log_SignIn";
import ArticlePage from "./pages/ArticleUnique";

import DashboardLayout from "./pages/Dashboard";

// ---- Sous-pages Dashboard ----
import ArticlesPage from "./pages/Dashboard/ArticlesPage";
import UserPage from "./pages/Dashboard/UserPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import FichierData from "./pages/Dashboard/FichierData";
import Administration from "./pages/Dashboard/Administration";
import ThemeSettingsPage from "./pages/Dashboard/ThemeSettingPage";

import "./App.css";
import "./pages/theme.css";

function App() {
  window.addEventListener("beforeunload", () => {
    if (!localStorage.getItem("remember")) {
      localStorage.removeItem("jwt");
    }
  });

  const [themeSlug, setThemeSlug] = useState('DarkTheme');  
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8000/api/sites")
      .then((res) => res.json())
      .then((data) => {
        // Sécurisation au cas où "member" ou [0] n'existe pas
        if (data.member && data.member.length > 0) {
            const first = data["member"][0];
            setThemeSlug(first.Theme.Slug);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // Le loading doit s'arrêter même en cas d'erreur
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [location]);

  return (
    <div className={`body ${themeSlug}_body`}>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      <Header theme={themeSlug} />

      <Routes>
        <Route path="/" element={<Accueil theme={themeSlug} />} />
        <Route path="/categories" element={<Categories theme={themeSlug} />} />
        
        {/* CORRECTION: Utilisation de :slug et suppression de la prop slug={slug} qui n'existe pas ici */}
        <Route path="/article/:slug" element={<ArticlePage theme={themeSlug} />} />

        {/* DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={<DashboardLayout theme={themeSlug} />}
        >
          <Route index element={<ProfilePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="FichierData" element={<FichierData />} />
          <Route path="Administration" element={<Administration />} />
          <Route path="Theme" element={<ThemeSettingsPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Le Wildcard doit être en dernier pour éviter de bloquer les autres routes */}
        <Route path="/*" element={<Log_SignIn theme={themeSlug} />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;