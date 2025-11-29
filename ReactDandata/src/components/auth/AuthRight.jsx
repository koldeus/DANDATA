import React from "react";
import Plasma from "../Plasma";
import "./AuthRight.css";
import "../../pages/theme.css";

export default function AuthRight({ theme }) {
  const LightRaysColor = {
    DarkTheme: "#AD1B3B",
    LightTheme: "#363ab8",
    NightTheme: "#7577bd ",
  };
  return (
    <div className="auth-right-wrapper">
      <Plasma
        color={LightRaysColor[theme]}
        speed={0.9}
        direction="forward"
        scale={1.0}
        opacity={1}
        mouseInteractive={true}
      />
      <div className="plasma-overlay" />
      <div className="auth-right-content"></div>
    </div>
  );
}
