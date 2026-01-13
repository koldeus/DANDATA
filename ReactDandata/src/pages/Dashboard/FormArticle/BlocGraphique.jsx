import React from "react";
import GraphPreview from "./GraphPreview";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BlocGraphique({
  bloc,
  updateBloc,
  metadonnees,
  variableCache,
  theme
}) {
  const getMetadataByIRI = (iri) => {
    return metadonnees.find(
      (m) => `${API_BASE_URL}/api/metadonnees/${m.id}` === iri
    );
  };

  const metadata = bloc.graphique.metadonnees
    ? getMetadataByIRI(bloc.graphique.metadonnees)
    : null;

  return (
    <>
      <div className="form-group">
        <label htmlFor={`graph-type-${bloc.id}`}>Type</label>
        <select 
        className={`${theme}_subbtle-background ${theme}_Border`}
          id={`graph-type-${bloc.id}`}
          value={bloc.graphique.type}
          onChange={(e) =>
            updateBloc(bloc.id, {
              graphique: { ...bloc.graphique, type: e.target.value },
            })
          }
        >
          <option value="bar">📊 Barres</option>
          <option value="pie">🥧 Camembert</option>
          <option value="line">📈 Ligne</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={`dataset-${bloc.id}`}>Dataset</label>
        <select
          id={`dataset-${bloc.id}`}
          value={bloc.graphique.metadonnees || ""}
          className={`${theme}_subbtle-background ${theme}_Border`}
          onChange={(e) =>
            updateBloc(bloc.id, {
              graphique: {
                ...bloc.graphique,
                metadonnees: e.target.value,
                variables: [],
              },
            })
          }
        >
          <option value="">-- Sélectionner --</option>
          {metadonnees.map((m) => (
            <option
              key={m.id}
              value={`${API_BASE_URL}/api/metadonnees/${m.id}`}
            >
              {m.nom}
            </option>
          ))}
        </select>
      </div>

      {bloc.graphique.metadonnees &&
        (metadata?.variables ? (
          <div className={`variables-selection ${theme}_subbtle-background ${theme}_Border`}>
            <p>
              <strong>Variables :</strong>
            </p>
            {metadata.variables.map((v) => (
              <label key={v} className="checkbox-label">
                <input
                  type="checkbox"
                  value={v}
                  checked={bloc.graphique.variables.includes(v)}
                  onChange={(e) => {
                    const newVars = e.target.checked
                      ? [...bloc.graphique.variables, v]
                      : bloc.graphique.variables.filter((id) => id !== v);
                    updateBloc(bloc.id, {
                      graphique: {
                        ...bloc.graphique,
                        variables: newVars,
                      },
                    });
                  }}
                />
                <span>{variableCache[v] || "Chargement..."}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-muted">Aucune variable</p>
        ))}

      <GraphPreview
        graphique={bloc.graphique}
        metadonnees={metadonnees}
        theme={theme}
      />
    </>
  );
}