import LightRays from "../components/LightRays";

export function Accueil() {
  return (
    <div>
      <LightRays
        raysOrigin="top-center"
        raysColor="#AD1B3B"
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
      <p>Votre plateforme de données et d'analyses</p>
    </div>
  );
}
