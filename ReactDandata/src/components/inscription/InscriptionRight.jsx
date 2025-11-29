import React from "react";
import SignUpForm from "./InscriptionForm";
import "./InscriptionRight.css";
import "../../pages/theme.css";

export default function AuthLeft({ theme }) {
  function rtn() {
    window.history.back();
  }

  return (
    <div className="inscription-right-container">
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
      <SignUpForm theme={theme} />
    </div>
  );
}
