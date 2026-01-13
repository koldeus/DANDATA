import React from "react";

export default function ContentSection({ addBloc, blocsLength,theme }) {
  return (
    <section className="form-section">
      <h2>📄 Contenu</h2>
      <div className="bloc-toolbar">
        <button type="button" onClick={() => addBloc("titre")}>
          + Titre
        </button>
        <button type="button" onClick={() => addBloc("texte")}>
          + Texte
        </button>
        <button type="button" onClick={() => addBloc("image")}>
          + Image
        </button>
        <button type="button" onClick={() => addBloc("graphique")}>
          + Graphique
        </button>
      </div>

      {blocsLength === 0 && (
        <p className="empty-state">
          Aucun bloc. Utilisez les boutons ci-dessus.
        </p>
      )}
    </section>
  );
}