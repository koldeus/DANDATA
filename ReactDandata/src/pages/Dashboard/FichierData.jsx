import React, { useEffect, useState } from "react";
import "../../components/Dashboard/formCSV/CSVUpload.css";
import CSVUpload from "../../components/Dashboard/formCSV/CSVUpload";
import { useAuthToken, useUser } from "../../hooks/useUser";
import SousChargement from "../../components/SousChargement/SousChargement";

const FichierData = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("upload");

  // CSV
  const [csvFiles, setCsvFiles] = useState([]);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { getToken } = useAuthToken();
  const { user, loading: userLoading } = useUser();

 
  async function fetchCsvFiles() {
    setLoadingCsv(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch("http://localhost:8000/api/metadonnees", {
        headers: {
          Accept: "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setCsvFiles(Array.isArray(data.member) ? data.member : []);
    } catch (err) {
      setError("Impossible de charger les fichiers CSV");
    } finally {
      setLoadingCsv(false);
    }
  }

  useEffect(() => {
    if (activeTab === "manage") {
      fetchCsvFiles();
    }
  }, [activeTab]);

  async function handleDelete(csv) {
    if (!window.confirm("Supprimer ce fichier CSV ?")) return;

    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8000${csv["@id"]}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok && res.status !== 204) throw new Error();

      setCsvFiles((prev) => prev.filter((f) => f["@id"] !== csv["@id"]));
      setSuccess("Fichier CSV supprimé");
    } catch (err) {
      setError("Suppression impossible");
    }
  }

  function extractId(item) {
    if (item?.id) return item.id;
    if (item?.["@id"]) {
      const m = item["@id"].match(/\/(\d+)$/);
      return m ? Number(m[1]) : null;
    }
    return null;
  }

  if (userLoading) return <SousChargement />;

  return (
    <div className={`fichier-data ${theme}_light-background ${theme}_Border`}>
     
      <div className="tabs">
        <button
          className={activeTab === "upload" ? "tab active" : "tab"}
          onClick={() => setActiveTab("upload")}
        >
          Analyse & Upload
        </button>
        <button
          className={activeTab === "manage" ? "tab active" : "tab"}
          onClick={() => setActiveTab("manage")}
        >
          Fichiers CSV
        </button>
      </div>


      {activeTab === "upload" && (
        <>
          <h2 className="titre-data">
            Bienvenue sur la partie analyse de Dandata !
          </h2>

          <p className="p-data">
            Téléversez, visualisez et analysez vos données avec un outil
            polyvalent et puissant.
          </p>

          <div className="upload-section">
            <div className="upload-box">
              <CSVUpload theme={theme} />
            </div>
          </div>

          <div className="cards-section">
            <div className={`card ${theme}_subbtle-background ${theme}_Border`}>
              <div className="card-icon">📊</div>
              <div className={`${theme}_subbtle-texte card-title`}>
                Visualisez
              </div>
              <div className="card-desc">
                Créez des graphiques interactifs et poussés
              </div>
            </div>

            <div className={`card ${theme}_subbtle-background ${theme}_Border`}>
              <div className="card-icon">📈</div>
              <div className={`${theme}_subbtle-texte card-title`}>
                Analysez
              </div>
              <div className="card-desc">
                Extrayez des statistiques d’après vos données
              </div>
            </div>
          </div>
        </>
      )}

    
      {activeTab === "manage" && (
        <div className="csv-management">
          <h2>Gestion des fichiers CSV</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {loadingCsv ? (
            <SousChargement />
          ) : csvFiles.length === 0 ? (
            <p className={`${theme}_subbtle-texte`}>Aucun fichier CSV</p>
          ) : (
            <div className="csv-list">
              {csvFiles.map((csv) => {
                const id = extractId(csv);
                return (
                  <div
                    key={id}
                    className={`csv-item ${theme}_Border ${theme}_subbtle-background`}
                  >
                    <span className="csv-name">
                      {csv.filename || csv.nom || `CSV #${id}`}
                    </span>

                    <button
                      className="btn-delete"
                      disabled={!user?.roles?.includes("ROLE_ADMIN")&&!user?.roles?.includes("ROLE_DATA_PROVIDER")}
                      onClick={() => handleDelete(csv)}
                    >
                      Supprimer
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FichierData;
