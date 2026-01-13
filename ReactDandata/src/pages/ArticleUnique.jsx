import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroArticle from "../components/Article/HeroArticle";
import ArticleContent from "../components/Article/ArticleBloc";
import ArticleActions from "../components/Article/ArticleAction";
import ArticleAuthor from "../components/Article/ArticleAuthor";
import SousChargement from "../components/SousChargement/SousChargement";

import ArticleNotFound from "../components/Article/ArticleNotFound";
import "./ArticleUnique.css";

export default function ArticleUnique({ theme }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/articles/slug/${slug}`
        );
        if (!res.ok) {
          throw new Error("Article non trouvé");
        }
        const data = await res.json();
        setArticle(data);

        if (data.theme.slug) {
          setCurrentTheme(data.theme.slug);
        }
      } catch (err) {
        console.error("Erreur chargement article", err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <SousChargement theme={currentTheme} />;
  }

  if (!article) {
    return (
      <ArticleNotFound theme={currentTheme} onGoHome={() => navigate("/")} />
    );
  }

  return (
    <article className={`article-unique ${currentTheme}_body`}>
      <HeroArticle theme={currentTheme} article={article} />

      <ArticleContent article={article} theme={currentTheme} />

      <ArticleActions theme={currentTheme} />

      <ArticleAuthor auteur={article.auteur} theme={currentTheme} />
    </article>
  );
}
