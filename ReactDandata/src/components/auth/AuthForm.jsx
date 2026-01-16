import React, { useState } from "react";
import "./AuthForm.css";
import "../../pages/theme.css";

export default function AuthForm({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      return setError(
        "Mot de passe ou email invalide. Veuillez vérifier vos informations."
      );
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError("Email ou mot de passe incorrect.");
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);

        if (remember) {
          localStorage.setItem("remember", "true");
        }

        window.history.back();
      } else {
        setError("Erreur lors de la connexion.");
      }
    } catch (err) {
      setError("Erreur serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-card ${theme}_subbtle-background`}>
      <h2>Bienvenue</h2>
      <p className={`subbtitle ${theme}_subbtle-texte`}>
        Connectez-vous pour accéder à votre espace
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        
        <label className="field">
          <span>Email</span>
          <input
            className={`${theme}_light-background`}
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className={`field field-password`}>
          <span>Mot de passe</span>
          <input
            className={`${theme}_light-background`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            aria-pressed={showPassword}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L23 23"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.94 17.94C16.11 18.66 14.07 19 12 19C7 19 2.73 15.89 1 12C1.88 9.96 3.47 8.16 5.4 6.84"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <div className={`forgot ${theme}_subbtle-texte`}>
            Mot de passe oublié ?
          </div>
        </label>

        <label className={`remember ${theme}_subbtle-texte`}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Se souvenir de moi
        </label>

        <button
          className={`btn-primaire-co ${theme}_Light-Btn-inverse`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <div className="divider">
          <span>ou</span>
        </div>

        <div className="social">
          <button className={`btn-outline ${theme}_Light-Btn`}>
            Continuer avec GitHub
          </button>
          <button className={`btn-outline ${theme}_Light-Btn`}>
            Continuer avec Google
          </button>
        </div>

        <div className={`signup ${theme}_subbtle-texte`}>
          Pas encore de compte ?{" "}
          <a href="/SignIn" className={`${theme}_link`}>
            Créer un compte
          </a>
        </div>
      </form>
    </div>
  );
}