import React from "react";
import PropTypes from "prop-types";
import { Calendar, User, Star } from "lucide-react";
import "./ArticleUne.css";

export default function ArticleUne({ article, theme }) {
  if (!article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <a href={`/article/${article.slug}`} style={{ textDecoration: "none" }}>
      <div className={`article-une-wrapper ${theme}_subbtle-texte`}>
        <div className={`article-une`}>
          <div className="article-une-image-container">
            {article.imagePrincipale?.url ? (
              <img
                src={"http://localhost:8000" + article.imagePrincipale.url}
                alt={article.imagePrincipale.alt || article.titre}
                className="article-une-image"
              />
            ) : (
              <div className="article-une-image-placeholder">
                <span className="article-une-no-image-text">
                  Image non disponible
                </span>
              </div>
            )}

            {article.moyenneNotes && (
              <div className="article-une-rating-badge">
                <Star className="article-une-star-icon" />
                <span>{article.moyenneNotes}</span>
              </div>
            )}
          </div>

          <div className="article-une-content">
            <h2 className="article-une-title">{article.titre}</h2>

            <div className="article-une-badges">
              {article.categories?.map((cat, index) => (
                <span key={index} className="article-une-category-badge">
                  {cat.Nom ? cat.Nom : "Catégorie inconnue"}
                </span>
              ))}
            </div>

            <div className="article-une-separator" />

            <p className={`article-une-resume ${theme}_subbtle-texte`}>
              {article.resume || "Aucun résumé disponible"}
            </p>

            <div className="article-une-separator" />

            <div className={`article-une-meta ${theme}_subbtle-texte`}>
              <div className="article-une-meta-item">
                <User className="article-une-icon" />
                <span>{article.auteur?.pseudo || "Anonyme"}</span>
              </div>

              <div className="article-une-meta-item">
                <Calendar className="article-une-icon" />
                <span>{formatDate(article.createdAt)}</span>
              </div>

              <div className="article-une-meta-item">
                <Star className="article-une-icon" />
                <span>{article.nombreNotes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

ArticleUne.propTypes = {
  article: PropTypes.shape({
    slug: PropTypes.string,
    imagePrincipale: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
    }),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        Nom: PropTypes.string,
      })
    ),
    moyenneNotes: PropTypes.number,
    titre: PropTypes.string,
    resume: PropTypes.string,
    auteur: PropTypes.shape({
      pseudo: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    nombreNotes: PropTypes.number,
  }),
  theme: PropTypes.string,
};