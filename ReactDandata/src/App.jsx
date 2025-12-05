import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageLoader from "./components/chargement/PageLoader";
import { Accueil } from "./pages/Accueil";
import { Categories } from "./pages/Categories";
import Log_SignIn from "./pages/Log_SignIn";

import DashboardLayout from "./pages/Dashboard";

// ---- Sous-pages Dashboard ----
import ArticlesPage from "./pages/Dashboard/ArticlesPage"
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

  const [themeSlug, setThemeSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8000/api/sites")
      .then((res) => res.json())
      .then((data) => {
        const first = data["member"][0];
        setThemeSlug(first.Theme.Slug);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [location]);

  return (
    <div className={`body ${themeSlug}_body`}>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      <Header />

      <Routes>

        {/* pages normales */}
        <Route path="/" element={<Accueil theme={themeSlug} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/*" element={<Log_SignIn theme={themeSlug} />} />

        {/* ------------ DASHBOARD PARENT (layout permanent) ------------ */}
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

      </Routes>

      <Footer />
    </div>
  );
}

export default App;

// import ImageUpload from './components/temps upload/ImageUpload';
// import CSVUpload from './components/temps upload/CSVUpload';

// export default function App() {
//   const handleImageUpload = (images) => {
//     console.log('Images uploadées:', images);
//   };

//   const handleCSVUpload = (dataset) => {
//     console.log('Dataset avec variables:', dataset);
//   };

//   return (
//     <>
//       <ImageUpload onImageUploaded={handleImageUpload} maxFiles={1} />
//       <CSVUpload onDatasetUploaded={handleCSVUpload} />
//     </>
//   );
// }