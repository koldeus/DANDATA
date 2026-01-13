import React from "react";
import "./ArticleAuthor.css";

export default function ArticleAuthor({ auteur, theme }) {
  if (!auteur) return null;

  return (
    <div className="article-author-wrapper">
      <div className={`article-author-card ${theme}_subbtle-background ${theme}_Border`}>
        <div className="author-content">
          <div className={`author-avatar-large ${theme}_author-avatar-large`}>
            {auteur.pseudo?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="author-info-large">
            <h3 className={`author-name-large ${theme}_texte`}>
              {auteur.pseudo}
            </h3>
            <p className={`author-email ${theme}_subbtle-texte`}>
              {auteur.email}
            </p>
            {auteur.bio && (
              <p className={`author-bio ${theme}_texte`}>
                {auteur.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}