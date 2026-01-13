import React, { use, useEffect, useState } from "react";
import ArticleCard from "../components/Cards/ArticleCard";
import ArticleUne from "../components/ArticleUne";
import SousChargement from "../components/SousChargement/SousChargement";
import CategoryNav from "./CategoriesNav";
import "./Categories.css";

export function Categories({ theme }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const articlesParCategorie = selectedCat
    ? articles.filter((art) => art.categories.some((c) => c.id === selectedCat))
    : articles;
  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        console.log("Categories API response:", data);
        const categoriesData = data["member"] || data.member || data;

        setCategories(categoriesData);
      })
      .catch((err) => console.error("Erreur chargement catégories", err));
  }, []);
  const [toutesMesCategories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("http://localhost:8000/api/articles");
        const data = await res.json();
        console.log("API response:", data);

        const articlesData = data["member"] || data.member || data;
        setArticles(articlesData);
      } catch (err) {
        console.error("Erreur chargement articles", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Articles à afficher : 6 par défaut, tous si showAll est true

  const hasMoreArticles = articles.length > 6;

  const mostRecent = [...articles].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )[0];

  const filteredArticles = showAll
    ? articlesParCategorie
    : articlesParCategorie.slice(0, 6);

  return (
    <div className={'theme-page' }>
      <ArticleUne theme={theme} article={mostRecent} />     
      {loading && <SousChargement />}
      <CategoryNav
        categories={toutesMesCategories}
        activeCategory={selectedCat}
        onCategoryChange={setSelectedCat}
        theme={theme}
      />
      <section className={`cards-section-categories `}>
        <div className={`cards-grid`}>
          {filteredArticles.map((element) => (
            <ArticleCard
              key={element.id || Math.random()}
              article={element}
              theme={theme}
            />
          ))}
        </div>

        {hasMoreArticles && (
          <button className="load-more-btn" onClick={toggleShowAll}>
            {showAll ? "Voir moins d'articles" : "Voir plus d'articles"}
          </button>
        )}
      </section>
    </div>
  );
}
