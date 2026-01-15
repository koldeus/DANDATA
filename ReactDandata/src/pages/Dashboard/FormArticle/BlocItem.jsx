import React from "react";
import BlocTitre from "./BlocTitre";
import BlocTexte from "./BlocTexte";
import BlocImage from "./BlocImage";
import BlocGraphique from "./BlocGraphique";

export default function BlocItem({
  bloc,
  index,
  theme,
  update,
  updateBloc,
  removeBloc,
  moveBloc,
  isFirst,
  isLast,
  metadonnees,
  variableCache,
  imagesServeur,
}) {
  return (
    <div className={`bloc ${theme}_light-background ${theme}_Border`}>
      <div className="bloc-header">
        <strong>
          {bloc.type.toUpperCase()} #{bloc.ordre}
        </strong>
        <div className="bloc-actions">
          <button
            type="button"
            onClick={() => moveBloc(index, -1)}
            disabled={isFirst}
            title="Monter"
          >
            ⬆
          </button>
          <button
            type="button"
            onClick={() => moveBloc(index, 1)}
            disabled={isLast}
            title="Descendre"
          >
            ⬇
          </button>
          <button
            type="button"
            onClick={() => removeBloc(bloc.id)}
            className="btn-danger"
            title="Supprimer"
          >
            ✕
          </button>
        </div>
      </div>

      {bloc.type === "titre" && (
        <BlocTitre bloc={bloc} updateBloc={updateBloc} theme={theme} />
      )}

      {bloc.type === "texte" && (
        <BlocTexte bloc={bloc} updateBloc={updateBloc} theme={theme} />
      )}

      {bloc.type === "image" && (
        <BlocImage
          bloc={bloc}
          updateBloc={updateBloc}
          imagesServeur={imagesServeur}
          theme={theme}
        />
      )}

      {bloc.type === "graphique" && (
        <BlocGraphique
          bloc={bloc}
          updateBloc={updateBloc}
          metadonnees={metadonnees}
          variableCache={variableCache}
          theme={theme}
        />
      )}
    </div>
  );
}
