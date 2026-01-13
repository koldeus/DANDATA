import ArticleCard from "./ArticleCard";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthToken, useUser } from "../../hooks/useUser";

export function ArticleCardAdmin({
  article,
  theme,
  onArticleDeleted,
  setArticle,
}) {
  const { getToken } = useAuthToken();

  function onEdit() {
    console.log("Edit article", article.id);
    // TODO: Ajouter la logique d'édition
  }

  async function onDelete(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/articles/${article.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        // Si le serveur renvoie 500, on entre ici
        const errorData = await res.json();
        console.log("Détails erreur backend:", errorData);
        return;
      }
      // Dans AdminCard.jsx
      if (res.ok) {
        // On appelle la fonction passée en props pour retirer l'article de la liste affichée
        onArticleDeleted(article.id);
      }
      // Succès
    } catch (error) {
      // ICI : Tu as peut-être écrit console.log(res) au lieu de console.log(error)
      console.error("Erreur de connexion:", error);
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
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(article.id)}
          className={`${theme}_Light-Btn`}
          aria-label="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
