import React from "react";
import GlareHover from "./cardGlare";
import { Calendar, User, Star } from "lucide-react";
import "./ArticleCard.css";

function ArticleCard({ article, theme }) {
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

  const categorie = article.categories?.[0]?.Nom || "Non catégorisé";

  return (
    <a href={`/article/${article.slug}`} style={{ textDecoration: "none" }}>
      <div className={"article-card-wrapper " + ` ${theme}_subbtle-texte`}>
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
        >
          <div
            className={
              "article-card" + ` ${theme}_Border ${theme}_subbtle-background`
            }
          >
            <div className="article-card-image-container">
              {article.imagePrincipale?.url ? (
                <img
                  src={"http://localhost:8000" + article.imagePrincipale.url}
                  alt={article.imagePrincipale.alt || article.titre}
                  className="article-card-image"
                />
              ) : (
                <div className="article-card-image-placeholder">
                  <span className="article-card-no-image-text">
                    Pas d'image
                  </span>
                </div>
              )}
              <div className="article-card-badges">
                {article.categories.map((cat, index) => (
                  <span
                    key={cat.id || index}
                    className="article-card-category-badge"
                  >
                    {cat.Nom ? cat.Nom : "Catégorie inconnue"}
                  </span>
                ))}
              </div>
              {article.moyenneNotes && (
                <div className="article-card-rating-badge">
                  <Star className="article-card-star-icon" />
                  <span>{article.moyenneNotes}</span>
                </div>
              )}
            </div>

            <div className="article-card-content">
              <h2 className="article-card-title">{article.titre}</h2>

              <div className="article-card-separator" />

              <p className={"article-card-resume " + ` ${theme}_subbtle-texte`}>
                {article.resume || "Aucun résumé disponible"}
              </p>

              <div className="article-card-separator" />

              <div className={"article-card-meta " + ` ${theme}_subbtle-texte`}>
                <div className="article-card-meta-item">
                  <User className="article-card-icon" />
                  <span>{article.auteur?.pseudo || "Anonyme"}</span>
                </div>

                <div className="article-card-meta-item">
                  <Calendar className="article-card-icon" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>

                <div className="article-card-meta-item">
                  <Star className="article-card-icon" />
                  <span>{article.nombreNotes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </GlareHover>
      </div>
    </a>
  );
}

export default ArticleCard;
