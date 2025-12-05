// src/components/auth/AuthForm.jsx
import React, { useState } from "react";
import "./AuthForm.css";
import "../../pages/theme.css";

export default function AuthForm({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login = async (email, password, remember) => {
      try {
        const res = await fetch("http://localhost:8000/api/login_check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await res.json();
        if (data.token) {
          localStorage.setItem("jwt", data.token);
            window.history.back();
          if (remember) {
            localStorage.setItem("remember", true);
          }
        } else {
          console.error("Erreur login", data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    await login(email, password, remember);
  };

  return (
    <div className={`auth-card ${theme}_subbtle-background`}>
      <h2>Bienvenue</h2>
      <p className={`subbtitle ${theme}_subbtle-texte`}>
        Connectez-vous pour accéder à votre espace
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
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
            type={showPassword ? "text" : "password"} // <-- use toggle state
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

          <div className="forgot">Mot de passe oublié ?</div>
        </label>

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Se souvenir de moi
        </label>

        <button className={`btn-primary ${theme}_Border`} type="submit">
          Se connecter
        </button>

        <div className="divider">
          <span>ou</span>
        </div>

        <div className="social">
          <button className={`btn-outline ${theme}_Border`}>
            Continuer avec GitHub
          </button>
          <button className={`btn-outline ${theme}_Border`}>
            Continuer avec Google
          </button>
        </div>

        <div className={`signup ${theme}_subbtle-texte`}>
          Pas encore de compte ?{" "}
          <a href="#" className={`${theme}_link`}>
            Créer un compte
          </a>
        </div>
      </form>
    </div>
  );
}
