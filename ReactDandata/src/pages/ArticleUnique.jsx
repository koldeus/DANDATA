import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroArticle from "../components/Article/HeroArticle";
import ArticleContent from "../components/Article/ArticleBloc";
import ArticleAuthor from "../components/Article/ArticleAuthor";
import ArticleNotes from "../components/Article/ArticleNotes";
import RatingsDisplay from "../components/Article/RatingsDisplay";
import SousChargement from "../components/SousChargement/SousChargement";
import ArticleNotFound from "../components/Article/ArticleNotFound";
import "./ArticleUnique.css";

export default function ArticlePage({ theme, setThemeSlug }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setArticle(null);

    async function fetchArticle() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/articles/slug/${slug}`
        );
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.theme && data.theme.slug) {
            setThemeSlug(data.theme.slug);
          }
          
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Erreur chargement article", err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
    
    
  }, [slug, setThemeSlug]);

  if (loading) {
    return (
      <article className={`article-unique ${theme}_body`}>
        <SousChargement />
      </article>
    );
  }

  if (!article) {
    return <ArticleNotFound theme={theme} onGoHome={() => navigate("/")} />;
  }

  return (
    <article className={`article-unique ${theme}_body`}>
      <HeroArticle theme={theme} article={article} />
      <ArticleContent article={article} theme={theme} />
      <ArticleAuthor auteur={article.auteur} theme={theme} />
      <ArticleNotes article={article} theme={theme} />
      <RatingsDisplay article={article} theme={theme} />
    </article>
  );
}