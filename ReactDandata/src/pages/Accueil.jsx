import { use } from "react";
import LightRays from "../components/LightRays";
import ModelViewer from "../components/Three";
import "./Accueil.css";
import "./theme.css";

export function Accueil({ theme }) {
  const LightRaysColor = {
    DarkTheme: "#AD1B3B",
    LightTheme: "#4146df",
    NightTheme: "#7577bd",
  };
  return (
    <div className="accueil">
      <LightRays
        raysOrigin="top-center"
        raysColor={LightRaysColor[theme]}
        raysSpeed={0.8}
        lightSpread={0.8}
        rayLength={5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />

      <h1>Bienvenue sur DanData</h1>
      <div className="accueil-content">
        <p>
          Téléversez, visualisez, et analysez vos données avec un outil
          polyvalent et puissant ou postez des articles pour la communauté!
          <br />
          <br />
          Explorez une plateforme intuitive conçue pour simplifier la gestion de
          vos données et favoriser le partage de connaissances.
        </p>

        <div className="model-wrapper">
          <ModelViewer />
        </div>

        <p>
          Partagez vos analyses et découvertes avec une communauté passionnée
          par la data et l'innovation. Collaborez, apprenez et développez vos
          compétences grâce à des outils puissants et une interface moderne.
        </p>
      </div>

      <div className="BoiteDeBoite">
        <div
          className={`BoiteDeTexte ${theme}_subbtle-background ${theme}_Border`}
        >
          <h2>XXX Utilisateurs nous font confiances</h2>
          <p>
            Aujourd’hui plus de XXX utilisateurs ont lancés leur site web en
            faisant confiance à notre CMS.
          </p>
        </div>

        <div>
          <div
            className={`BoiteDeTexte ${theme}_subbtle-background ${theme}_Border`}
          >
            <h3>Visualisez</h3>
            <p className={`p ${theme}_subbtle-texte`}>
              Extrayez des statistiques d’après vos données
            </p>
          </div>
          <div
            className={`BoiteDeTexte ${theme}_subbtle-background ${theme}_Border`}
          >
            <h3>Importez vos données</h3>
            <p className={`p ${theme}_subbtle-texte`}>
              Extrayez des statistiques d’après vos données
            </p>
          </div>
          <div
            className={`BoiteDeTexte ${theme}_subbtle-background ${theme}_Border`}
          >
            <h3>Analysez</h3>
            <p className={`p ${theme}_subbtle-texte`}>
              Extrayez des statistiques d’après vos données
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
