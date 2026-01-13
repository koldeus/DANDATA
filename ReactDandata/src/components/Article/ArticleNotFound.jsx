import React from "react";
import "./ArticleNotFound.css";

export default function ArticleNotFound({ theme, onGoHome }) {
  return (
    <div className={`not-found-container ${theme}_body ${theme}_texte`}>
      <div className="not-found-content">
        <h1 className={`not-found-title ${theme}_texte`}>404</h1>
        <p className={`not-found-text ${theme}_texte`}>Article non trouvé</p>
        <button
          onClick={onGoHome}
          className={`not-found-button ${theme}_Light-Btn`}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}