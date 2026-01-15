import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import "./HeroArticle.css";

const ArticleCategories = ({ categories, theme }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="article-categories">
      {categories.map((cat) => (
        <span key={cat.id} className={`category-badge ${theme}_category-badge`}>
          {cat.Nom}
        </span>
      ))}
    </div>
  );
};

const ArticleMetadata = ({ article, theme }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`article-metadata`}>
      <div className="author-info">
        <div className={`author-avatar ${theme}_author-avatar`}>
          <span>{article.auteur?.pseudo?.[0]?.toUpperCase() || "A"}</span>
        </div>
        <div className="author-details">
          <p className={`author-name ${theme}_texte`}>
            {article.auteur?.pseudo || "Auteur inconnu"}
          </p>
        </div>
        <p className={`article-date ${theme}_subbtle-texte`}>
          {formatDate(article.createdAt)}
        </p>
      </div>

      {article.moyenneNotes && (
        <div className="rating-info">
          <Star className="star-icon" size={20} fill="currentColor" />
          <span className="rating-value">{article.moyenneNotes}</span>
          <span className={`rating-count ${theme}_subbtle-texte`}>
            ({article.nombreNotes} avis)
          </span>
        </div>
      )}
    </div>
  );
};

export default function HeroArticle({ theme, article }) {
  const navigate = useNavigate();

  return (
    <div className="hero-article">
      <nav className="nav-article">
        <button
          onClick={() => navigate(-1)}
          className={`article-go-back ${theme}_Light-Btn`}
        >
          <ArrowLeft size={24} />
        </button>
      </nav>

      {article.imagePrincipale && (
        <div className="div-image-principal">
          <img
            src={`http://localhost:8000${article.imagePrincipale.url}`}
            alt={article.imagePrincipale.alt || article.titre}
            className="principal-image"
          />
          
          <div className="image-overlay" />
        </div>
      )}

      <div className="article-header-content">

        <h1 className={`article-title ${theme}_texte`}>{article.titre}</h1>

        {article.resume && (
          <p className={`article-resume ${theme}_subbtle-texte`}>
            {article.resume}
          </p>
        )}

        <ArticleMetadata article={article} theme={theme} />
        <ArticleCategories categories={article.categories} theme={theme} />
      </div>
    </div>
  );
}
