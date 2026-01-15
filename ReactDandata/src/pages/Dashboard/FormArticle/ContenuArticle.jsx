import React from "react";
import Bloc from "./Bloc";

export default function ContenuArticle({
  blocs,
  setBlocs,
  metadonnees,
  imagesServeur,
  theme,
}) {
  const addBloc = (type) => {
    setBlocs((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        texte: "",
        niveau: 2,
        images: [],
        graphique: { type: "bar", metadonnees: null, variables: [] },
      },
    ]);
  };

  return (
    <section className="form-section">
      <h2>📄 Contenu</h2>
      <div className="bloc-toolbar">
        <button onClick={() => addBloc("titre")}>+ Titre</button>
        <button onClick={() => addBloc("texte")}>+ Texte</button>
        <button onClick={() => addBloc("image")}>+ Image</button>
        <button onClick={() => addBloc("graphique")}>+ Graphique</button>
      </div>

      {blocs.map((bloc, i) => (
        <Bloc
          key={bloc.id}
          bloc={bloc}
          index={i}
          blocs={blocs}
          setBlocs={setBlocs}
          metadonnees={metadonnees}
          imagesServeur={imagesServeur}
        />
      ))}
    </section>
  );
}
