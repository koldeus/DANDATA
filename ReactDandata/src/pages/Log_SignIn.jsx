import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import InscriptionLayout from "../components/inscription/InscriptionLayout";
import { Routes, Route } from "react-router-dom";

export default function Log_SignIn({ theme }) {
  return (
    <Routes>
      <Route path="LogIn" element={<AuthLayout theme={theme} />} />
      <Route path="SignIn" element={<InscriptionLayout theme={theme} />} />
    </Routes>
  );
}
