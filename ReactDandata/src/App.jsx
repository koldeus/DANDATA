import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import {Footer} from "./components/Footer";

import {Accueil} from "./pages/Accueil";
import {Categories} from "./pages/Categories";
import {LogIn} from "./pages/LogIn";
import {SignIn} from "./pages/SignIn";
import {Dashboard} from "./pages/Dashboard";

import "./App.css"

function App() {
  return (
    <div className="body-dark-theme">
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />

    </div>
  );
}

export default App;
