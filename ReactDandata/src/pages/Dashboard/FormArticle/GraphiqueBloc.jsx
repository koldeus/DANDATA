import React from "react";
import GraphPreview from "./GraphPreview";

export default function GraphiqueBloc({
  bloc,
  updateBloc,
  metadonnees,
  theme,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const getMetadataByIRI = (iri) => {
    return metadonnees.find(
      (m) => `${API_BASE_URL}/api/metadonnees/${m.id}` === iri
    );
  };

  return (
    <>
      <div className="form-group">
        <label>Type de graphique</label>
        <select
          value={bloc.graphique.type}
          onChange={(e) =>
            updateBloc({
              graphique: { ...bloc.graphique, type: e.target.value },
            })
          }
        >
          <option value="bar">Barres</option>
          <option value="pie">Camembert</option>
          <option value="line">Ligne</option>
        </select>
      </div>

      <div className="form-group">
        <label>Dataset</label>
        <select
          value={bloc.graphique.metadonnees || ""}
          onChange={(e) =>
            updateBloc({
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
        (() => {
          const metadata = getMetadataByIRI(bloc.graphique.metadonnees);
          if (!metadata?.variables) return <p>Aucune variable</p>;

          // Filtrer la variable d'identification
          const idVariableIRI = metadata.variableIdentification;
          const selectableVariables = metadata.variables.filter(
            (v) => v !== idVariableIRI
          );

          if (selectableVariables.length === 0) {
            return (
              <p>
                Aucune variable sélectionnable (toutes sont des identifiants)
              </p>
            );
          }

          return (
            <div className="variables-selection">
              <label className="variables-label">Variables disponibles :</label>
              {selectableVariables.map((v) => (
                <label key={v} className="variable-checkbox">
                  <input
                    type="checkbox"
                    checked={bloc.graphique.variables.includes(v)}
                    onChange={(e) => {
                      const newVars = e.target.checked
                        ? [...bloc.graphique.variables, v]
                        : bloc.graphique.variables.filter((id) => id !== v);
                      updateBloc({
                        graphique: { ...bloc.graphique, variables: newVars },
                      })
                    }}
                  />
                  {/* Afficher le nom de la variable ici si vous l'avez */}
                  <span>{v.split("/").pop()}</span>
                </label>
              ))}
              {idVariableIRI && (
                <p className="id-variable-info">
                  ℹ️ Variable d'identification exclue de la sélection
                </p>
              )}
            </div>
          );
        })()}

      <GraphPreview
        graphique={bloc.graphique}
        metadonnees={metadonnees}
        theme={theme}
      />
    </>
  );
}
