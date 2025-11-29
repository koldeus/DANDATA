import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageLoader from "./components/chargement/PageLoader";
import { Accueil } from "./pages/Accueil";
import { Categories } from "./pages/Categories";
import Log_SignIn from "./pages/Log_SignIn";
import { Dashboard } from "./pages/Dashboard";

import "./App.css";
import "./pages/theme.css";

function App() {
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
      {loading && (
        <PageLoader onComplete={() => setLoading(false)} />
      )}

      <Header />
      <Routes>
        <Route path="/" element={<Accueil theme={themeSlug} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/*" element={<Log_SignIn theme={themeSlug} />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;