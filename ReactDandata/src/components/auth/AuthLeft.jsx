import React from "react";
import AuthForm from "./AuthForm";
import "./AuthLeft.css";
import "../../pages/theme.css";

export default function AuthLeft({ theme }) {
  function rtn() {
    window.history.back();
  }

  return (
    <div className="auth-left-container">
      <div className="header-row">
        <div className="logo-login">
          <img src="public/images/logo.png" alt="Logo Dandata" />
          <h2>
            Dan<span>Data</span>
          </h2>
        </div>

        <div className="return" onClick={() => rtn()}>
          Retour
        </div>
      </div>
      <AuthForm theme={theme} />
    </div>
  );
}
