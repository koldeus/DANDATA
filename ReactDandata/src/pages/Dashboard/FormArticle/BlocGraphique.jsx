import GraphPreview from "./GraphPreview";
import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BlocGraphique({
  bloc,
  updateBloc,
  metadonnees,
  variableCache,
  theme,
}) {
  const [titre, setTitre] = useState(bloc.graphique?.titre || "");
  const [nbLigne, setNbLigne] = useState(bloc.graphique?.NbLigne || 10);

  const getMetadataByIRI = (iri) => {
    return metadonnees.find(
      (m) => `${API_BASE_URL}/api/metadonnees/${m.id}` === iri
    );
  };

  const metadata = bloc.graphique?.metadonnees
    ? getMetadataByIRI(bloc.graphique.metadonnees)
    : null;

  
  const maxLines = metadata?.NbLignesTotal || metadata?.nbLignesTotal || 1000;

  useEffect(() => {
    setTitre(bloc.graphique?.titre || "");
    setNbLigne(bloc.graphique?.NbLigne || 10);
  }, [bloc.graphique?.titre, bloc.graphique?.NbLigne]);

  useEffect(() => {
    if (bloc.graphique?.metadonnees && bloc.graphique.NbLigne === undefined) {
      updateBloc(bloc.id, {
        graphique: { ...bloc.graphique, NbLigne: 10 },
      });
    }
  }, [bloc.graphique?.metadonnees]);

  return (
    <>
      <div className="form-group">
        <label htmlFor={`titre-${bloc.id}`}>
          Titre du graphique <span className="required">*</span>
        </label>
        <input
          id={`titre-${bloc.id}`}
          type="text"
          value={titre}
          onChange={(e) => {
            const newTitre = e.target.value;
            setTitre(newTitre);
            updateBloc(bloc.id, {
              graphique: { ...bloc.graphique, titre: newTitre },
            });
          }}
          placeholder="Entrez le titre du graphique..."
          maxLength={200}
          required
          className={`${theme}_subbtle-background ${theme}_Border`}
        />
        <small className={`${theme}_subbtle-texte`}>{titre.length}/200</small>
      </div>

      <div className="form-group">
        <label htmlFor={`graph-type-${bloc.id}`}>Type de graphique</label>
        <select
          className={`${theme}_subbtle-background ${theme}_Border`}
          id={`graph-type-${bloc.id}`}
          value={bloc.graphique?.type || 'bar'}
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
        <label htmlFor={`dataset-${bloc.id}`}>
          Dataset <span className="required">*</span>
        </label>
        <select
          id={`dataset-${bloc.id}`}
          value={bloc.graphique?.metadonnees || ""}
          className={`${theme}_subbtle-background ${theme}_Border`}
          onChange={(e) =>
            updateBloc(bloc.id, {
              graphique: {
                ...bloc.graphique,
                metadonnees: e.target.value,
                variables: [],
                NbLigne: 10,
              },
            })
          }
        >
          <option value="">-- Sélectionner un dataset --</option>
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

      {bloc.graphique?.metadonnees && metadata && (
        <>
          <div className="form-group">
            <label htmlFor={`nbligne-${bloc.id}`}>
              Nombre de lignes à afficher <span className="required">*</span>
            </label>
            <input
              id={`nbligne-${bloc.id}`}
              type="number"
              max={maxLines}
              min="1"
              value={nbLigne}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  setNbLigne('');
                  return;
                }
                
                const newNbLigne = Math.min(
                  Math.max(parseInt(inputValue, 10) || 1, 1),
                  maxLines
                );
                setNbLigne(newNbLigne);
                updateBloc(bloc.id, {
                  graphique: { ...bloc.graphique, NbLigne: newNbLigne },
                });
              }}
              onBlur={(e) => {
                if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                  const defaultValue = 10;
                  setNbLigne(defaultValue);
                  updateBloc(bloc.id, {
                    graphique: { ...bloc.graphique, NbLigne: defaultValue },
                  });
                }
              }}
              placeholder="Nombre de lignes..."
              required
              className={`${theme}_subbtle-background ${theme}_Border`}
            />
            <small className={`${theme}_subbtle-texte`}>
              Maximum disponible : {maxLines} lignes
            </small>
          </div>

          {metadata.variables ? (
            <div
              className={`variables-selection ${theme}_subbtle-background ${theme}_Border`}
            >
              <p>
                <strong>Variables disponibles :</strong>
              </p>
              {metadata.variables.map((v) => (
                <label key={v} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={v}
                    checked={bloc.graphique?.variables?.includes(v) || false}
                    onChange={(e) => {
                      const currentVars = bloc.graphique?.variables || [];
                      const newVars = e.target.checked
                        ? [...currentVars, v]
                        : currentVars.filter((id) => id !== v);
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
            <p className="text-muted">
              Aucune variable disponible pour ce dataset
            </p>
          )}
        </>
      )}

      {bloc.graphique?.metadonnees && metadata && (
        <GraphPreview
          graphique={bloc.graphique}
          metadonnees={metadonnees}
          theme={theme}
          titre={titre}
          nbLigne={nbLigne}
        />
      )}
    </>
  );
}