import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import FormeArticle from "./forme-article";
import EditArticle from "./EditArticle";
import SousChargement from "../../components/SousChargement/SousChargement";
import { ArticleCardAdmin } from "../../components/Cards/AdminCard";
import "./ArticlesPage.css";

export default function ArticlesPage({ theme }) {
  const { user, loading } = useUser();
  const [mode, setMode] = useState("list"); // "list", "create", "edit"
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [slug, setslug] = useState(null);

  const allowedRoles = ["ROLE_ADMIN", "ROLE_EDITOR"];

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("http://localhost:8000/api/articles");
        const data = await res.json();

        const articlesData = data["member"] || data.member || data;
        setArticles(articlesData);
      } catch (err) {
        console.error("Erreur chargement articles", err);
      } finally {
        setLoadingArticles(false);
      }
    }

    fetchArticles();
  }, []);

  const handleEdit = (slug) => {
    setslug(slug);
    setMode("edit");
  };

  const handleEditSuccess = (updatedArticle) => {
    // Mettre à jour la liste des articles
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );

    // Retourner à la liste
    setMode("list");
    setslug(null);
  };

  if (loading) return <SousChargement />;

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="articles-page">
      {/* HEADER */}
      <div className="articles-header">
        <h2>Articles</h2>
        {mode === "list" && (
          <button onClick={() => setMode("create")}>
            ➕ Ajouter un article
          </button>
        )}
        {(mode === "create" || mode === "edit") && (
          <button
            onClick={() => {
              setMode("list");
              setslug(null);
            }}
          >
            ← Retour à la liste
          </button>
        )}
      </div>
      {/* CONTENU */}
      {mode === "list" && (
        <div className="articles-list">
          {loadingArticles ? (
            <SousChargement />
          ) : (
            articles.map((element) => (
              <ArticleCardAdmin
                key={element.id || Math.random()}
                article={element}
                theme={theme}
                onArticleDeleted={(deletedId) =>
                  setArticles(articles.filter((a) => a.id !== deletedId))
                }
                onArticleEdit={handleEdit}
                setArticles={setArticles}
              />
            ))
          )}
        </div>
      )}
      {mode === "create" && <FormeArticle theme={theme} />}
      {mode === "edit" && slug && (
        <EditArticle theme={theme} slug={slug} onSuccess={handleEditSuccess} />
      )}
    </div>
  );
}
