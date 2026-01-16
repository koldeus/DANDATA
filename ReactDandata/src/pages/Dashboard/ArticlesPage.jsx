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

  const allowedRoles = ["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_AUTHOR"];

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
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );

    setMode("list");
    setslug(null);
  };

  if (loading) return <SousChargement />;

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
    return <div>Accès refusé</div>;
  }

  // Déterminer les droits de l'utilisateur
  const SuperDroit = ["ROLE_ADMIN", "ROLE_EDITOR"];
  const FullDroit = user.roles.some((r) => SuperDroit.includes(r));

  // Filtrer les articles pour les auteurs (ROLE_AUTHOR)
  const filteredArticles = FullDroit
    ? articles
    : articles.filter((article) => article.auteur?.id === user.id);

  return (
    <div className="articles-page">
      <div className="articles-header">
        <h2>Articles</h2>
        {mode === "list" && (
          <button
            onClick={() => setMode("create")}
            className={`button-Article-Add ${theme}_Light-Btn`}
          >
            + Ajouter un article
          </button>
        )}
        {(mode === "create" || mode === "edit") && (
          <button
            onClick={() => {
              setMode("list");
              setslug(null);
            }}
            className={`${theme}_Light-Btn button-Article-Add`}
          >
            ← Retour à la liste
          </button>
        )}
      </div>

      {mode === "list" && (
        <div className="articles-list">
          {loadingArticles ? (
            <SousChargement />
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((element) => (
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
          ) : (
            <p>Aucun article trouvé</p>
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
