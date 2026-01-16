import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageLoader from "./components/chargement/PageLoader";
import { Accueil } from "./pages/Accueil";
import { Categories } from "./pages/Categories";
import Log_SignIn from "./pages/Log_SignIn";
import ArticlePage from "./pages/ArticleUnique";

import DashboardLayout from "./pages/Dashboard";
import ArticlesPage from "./pages/Dashboard/ArticlesPage";
import UserPage from "./pages/Dashboard/UserPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import FichierData from "./pages/Dashboard/FichierData";
import Administration from "./pages/Dashboard/Administration";
import ThemeSettingsPage from "./pages/Dashboard/ThemeSettingPage";

import GoTop from "./components/scroll-to-top";

import "./App.css";
import "./pages/theme.css";

function App() {
  useEffect(() => {
    const handleUnload = () => {
      if (!localStorage.getItem("remember")) {
        localStorage.removeItem("jwt");
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const [themeSlug, setThemeSlug] = useState("DarkTheme"); 
  const [defaultTheme, setDefaultTheme] = useState("DarkTheme");
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const [showGoTop, setshowGoTop] = useState("goTopHidden");
  const refScrollUp = useRef();

  useEffect(() => {
    const handleVisibleButton = () => {
      const position = window.pageYOffset;
      if (position > 200) {
        setshowGoTop("goTop");
      } else {
        setshowGoTop("goTopHidden");
      }
    };

    window.addEventListener("scroll", handleVisibleButton);
    
    return () => {
      window.removeEventListener("scroll", handleVisibleButton);
    };
  }, []);

  const handleScrollUp = () => {
    refScrollUp.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/sites")
      .then((res) => res.json())
      .then((data) => {
        if (data.member && data.member.length > 0) {
          const first = data["member"][0];
          const siteTheme = first.Theme.Slug;

          setDefaultTheme(siteTheme);

          if (!location.pathname.startsWith("/article/")) {
            setThemeSlug(siteTheme);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); 

  useEffect(() => {
    setLoading(true);
  }, [location.pathname]);

  useEffect(() => {

    if (!location.pathname.startsWith('/article/')) {
      if (themeSlug !== defaultTheme) {
        setThemeSlug(defaultTheme);
      }
    }
  }, [location.pathname, defaultTheme, themeSlug]);

  return (
    <div className={`body ${themeSlug}_body`} ref={refScrollUp}>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      <Header theme={themeSlug} />

      <Routes>
        <Route path="/" element={<Accueil theme={themeSlug} />} />
        <Route path="/categories" element={<Categories theme={themeSlug} />} />

        <Route
          path="/article/:slug"
          element={
            <ArticlePage theme={themeSlug} setThemeSlug={setThemeSlug} />
          }
        />

        <Route
          path="/dashboard"
          element={<DashboardLayout theme={themeSlug} />}
        >
          <Route index element={<ProfilePage theme={themeSlug} />} />
          <Route path="articles" element={<ArticlesPage theme={themeSlug} />} />
          <Route path="FichierData" element={<FichierData theme={themeSlug} />} />
          <Route path="Administration" element={<Administration theme={themeSlug} />} />
          <Route path="Theme" element={<ThemeSettingsPage theme={themeSlug} />} />
          <Route path="users" element={<UserPage theme={themeSlug} />} />
          <Route path="profile" element={<ProfilePage theme={themeSlug} />} />
        </Route>

        <Route path="/*" element={<Log_SignIn theme={themeSlug} />} />
      </Routes>

      <Footer theme={themeSlug} />
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp} theme={themeSlug}/>
    </div>
  );
}

export default App;