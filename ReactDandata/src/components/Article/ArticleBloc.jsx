import React from "react";
import "./ArticleBloc.css";

export default function ArticleContent({ article, theme }) {
    console.log(article.blocs)
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
          >
            {bloc.texte}
          </HeadingTag>
        );

      case "texte":
        return (
          <p key={bloc.id} className={`bloc-texte ${theme}_texte`}>
            {bloc.texte}
          </p>
        );

      case "image":
        return (
          <div key={bloc.id} className="bloc-image">
            {bloc.images &&
              bloc.images.map((image) => (
                <img
                  key={image.id}
                  src={`http://localhost:8000${image.url}`}
                  alt={image.alt}
                  className="bloc-image-item"
                />
              ))}
          </div>
        );

      case "graphique":
        return (
          <div
            key={bloc.id}
            className={`bloc-graphique ${theme}_subbtle-background ${theme}_Border`}
          >
            <h3 className={`bloc-graphique-titre ${theme}_texte`}>
              {bloc.graphique?.titre}
            </h3>
            <p className={`bloc-graphique-info ${theme}_subbtle-texte`}>
              Type: {bloc.graphique?.type}
            </p>
            <p className={`bloc-graphique-info ${theme}_subbtle-texte`}>
              Métadonnées: {bloc.graphique?.metadonnees?.nom}
            </p>
            {bloc.graphique?.variables && (
              <div className="bloc-graphique-variables">
                <p className={`variables-titre ${theme}_texte`}>Variables:</p>
                <ul className="variables-list">
                  {bloc.graphique.variables.map((variable) => (
                    <li key={variable.id} className={`${theme}_texte`}>
                      {variable.nom}
                    </li>
                  ))}
                </ul>
              </div>
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
