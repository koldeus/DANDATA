import React from "react";
import "./FichierData.css";
import CSVUpload from "../../components/Dashboard/formCSV/CSVUpload";

const FichierData = ({theme}) => {
  return (
    <div>
      <h2 className="titre-data">Bienvenue sur la partie analyse de Dandata !</h2>
      <p className="p-data">
        Téléversez, visualisez et analysez vos données avec un outil polyvalent
        et puissant.
      </p>

      <div className="upload-section">
        <div className="upload-box">
          <CSVUpload theme={theme} />
        </div>
      </div>

      <div className="cards-section">
        <div className={`card ${theme}_subbtle-background ${theme}_Border`}>
          <div className="card-icon">
            <span role="img" aria-label="chart">
              📊
            </span>
          </div>
          <div className={`card-title ${theme}_subbtle-texte`}>Visualisez</div>
          <div className="card-desc">
            Créez des graphiques interactifs et poussés
          </div>
        </div>

        <div className={`card ${theme}_subbtle-background ${theme}_Border`}>
          <div className="card-icon">
            <span role="img" aria-label="analysis">
              📈
            </span>
          </div>
          <div className={`card-title ${theme}_subbtle-texte`}>Analysez</div>
          <div className="card-desc">
            Extrayez des statistiques d’après vos données
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichierData;
