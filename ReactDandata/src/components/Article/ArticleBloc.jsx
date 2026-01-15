import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import Graphique from "./Graphique";
import "./ArticleBloc.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ArticleContent({ article, theme }) {
  const [toutesLesMetadonnees, setToutesLesMetadonnees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer TOUTES les métadonnées disponibles
    const fetchToutesLesMetadonnees = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/metadonnees`);
        if (res.ok) {
          const metadonnees = await res.json();
          // Si la réponse est un objet avec un tableau 'hydra:member'
          if (metadonnees["member"]) {
            setToutesLesMetadonnees(metadonnees["member"]);
          }
          // Si c'est directement un tableau
          else if (Array.isArray(metadonnees)) {
            setToutesLesMetadonnees(metadonnees);
          }
        }
      } catch (err) {
        console.error("Erreur chargement métadonnées:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToutesLesMetadonnees();
  }, []); // Charger une seule fois au montage

  const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "p", "br", "a"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  };

  const renderBloc = (bloc) => {
    switch (bloc.type) {
      case "titre":
        const HeadingTag = `h${bloc.niveau || 2}`;
        return (
          <HeadingTag
            key={bloc.id}
            className={`bloc-titre ${theme}_texte ${
              bloc.niveau === 2 ? "bloc-titre-h2" : "bloc-titre-h3"
            }`}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(bloc.texte) }}
          />
        );

      case "texte":
        return (
          <p
            key={bloc.id}
            className={`bloc-texte ${theme}_texte`}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(bloc.texte) }}
          />
        );

      case "image":
        return (
          <div key={bloc.id} className="bloc-image">
            {bloc.images &&
              bloc.images.map((image) => (
                <img
                  key={image.id}
                  src={`${API_BASE_URL}${image.url}`}
                  alt={image.alt}
                  className="bloc-image-item"
                />
              ))}
          </div>
        );

      case "graphique":
      console.log(bloc.graphique.titre);
        return (
          <div
            key={bloc.id}
            className={`bloc-graphique ${theme}_subbtle-background `}
          >
            {bloc.graphique?.titre && (
              <h3 className={`bloc-graphique-titre ${theme}_texte`}>
                {bloc.graphique.titre}
              </h3>
            )}
            {loading ? (
              <p className={`${theme}_subbtle-texte`}>
                Chargement des métadonnées...
              </p>
            ) : (
              <Graphique
                graphique={bloc.graphique}
                metadonnees={toutesLesMetadonnees}
                theme={theme}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="article-content-wrapper">
      <div className="article-content">
        {article.blocs && article.blocs.length > 0 ? (
          article.blocs
            .sort((a, b) => a.ordre - b.ordre)
            .map((bloc) => renderBloc(bloc))
        ) : (
          <p className={`no-content ${theme}_subbtle-texte`}>
            Contenu de l'article non disponible
          </p>
        )}
      </div>
    </div>
  );
}
