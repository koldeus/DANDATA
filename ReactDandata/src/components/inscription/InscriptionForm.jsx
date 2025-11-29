// src/components/inscription/InscriptionForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./InscriptionForm.css";
import "../../pages/theme.css";

export default function InscriptionForm({ theme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Veuillez entrer votre nom.");
    if (!validateEmail(email)) return setError("Veuillez entrer un mail valide.");
    if (password.length < 8)
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas");

    // Optional: call API to register the user
    try {
      setLoading(true);
      // Replace with your real API endpoint & payload
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Back-end may return validation errors; adjust parsing according to your API
        const msg = data?.message || "Erreur lors de l'inscription";
        setError(msg);
        setLoading(false);
        return;
      }
      // On success: maybe redirect to login page
      setLoading(false);
      navigate("/LogIn?registered=1");
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Réessayez plus tard.");
      setLoading(false);
    }
  };

  return (
    <div className={`auth-card ${theme}_subtle-background`}>
      <h2>Créer un compte</h2>
      <p className={`subbtitle ${theme}_subbtle-texte`}>Inscrivez-vous pour continuer</p>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nom</span>
          <input
            className={`${theme}_light-background`}
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

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

        {/* Password input with toggle */}
        <label className="field field-password">
          <span>Mot de passe</span>
          <input
            className={`${theme}_light-background`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mot de passe (min 8 caractères)"
          />
          <button
            type="button"
            className="toggle-password-2"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.94 17.94C16.11 18.66 14.07 19 12 19C7 19 2.73 15.89 1 12C1.88 9.96 3.47 8.16 5.4 6.84" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </label>

        {/* Confirm password input with toggle */}
        <label className="field field-password">
          <span>Confirmer le mot de passe</span>
          <input
            className={`${theme}_light-background`}
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password-2"
            aria-pressed={showConfirm}
            aria-label={showConfirm ? "Masquer la confirmation" : "Afficher la confirmation"}
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.94 17.94C16.11 18.66 14.07 19 12 19C7 19 2.73 15.89 1 12C1.88 9.96 3.47 8.16 5.4 6.84" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </label>

        <button className={`btn-primary ${theme}_Border`} type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <div className="divider">
          <span>ou</span>
        </div>

        <div className="social">
          <button className={`btn-outline ${theme}_Border`} type="button">
            Continuer avec GitHub
          </button>
          <button className={`btn-outline ${theme}_Border`} type="button">
            Continuer avec Google
          </button>
        </div>

        <div className={`signup ${theme}_subbtle-texte`}>
          Déjà un compte ?{" "}
          <Link to="/LogIn" className={`${theme}_link`}>
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}