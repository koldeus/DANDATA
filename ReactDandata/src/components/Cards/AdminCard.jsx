import ArticleCard from "./ArticleCard";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { useAuthToken } from "../../hooks/useUser";

export function ArticleCardAdmin({
  article,
  theme,
  onArticleDeleted,
  onArticleEdit,
  setArticles,
}) {
  const { getToken } = useAuthToken();

  function onEdit() {
    // Appeler la fonction passée en props pour activer le mode édition
    if (onArticleEdit) {
      onArticleEdit(article.slug);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    const token = await getToken();
    if (!token) {
      console.error("Token d'authentification manquant");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/articles/${article.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Détails erreur backend:", errorData);
        alert(
          `Erreur lors de la suppression: ${
            errorData.error || errorData.message || "Erreur inconnue"
          }`
        );
        return;
      }

      // Succès - retirer l'article de la liste
      onArticleDeleted(article.id);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur de connexion au serveur");
    }
  }

  return (
    <div className="article-card-admin">
      <ArticleCard article={article} theme={theme} />
      <div className="flex gap-2 article-card-admin-buttons">
        <button
          onClick={onEdit}
          className={`${theme}_Light-Btn-inverse`}
          aria-label="Modifier"
          title="Modifier l'article"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(article.id)}
          className={`${theme}_Light-Btn-inverse`}
          aria-label="Supprimer"
          title="Supprimer l'article"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
