import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import "./ProfilePage.css";
import SousChargement from "../../components/SousChargement/SousChargement";

export default function ProfilePage({ theme }) {
  const { user, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    currentPassword: "", // 🔥 AJOUT
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        pseudo: user.pseudo || "",
        currentPassword: "", // 🔥 réinitialisé
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const token = localStorage.getItem("jwt");

      // Champs modifiés
      const updatedFields = {};

      if (formData.email !== user.email) updatedFields.email = formData.email;
      if (formData.pseudo !== user.pseudo) updatedFields.pseudo = formData.pseudo;

      // 🔥 AJOUT : mot de passe obligatoire pour valider
      updatedFields.currentPassword = formData.currentPassword;

      if (Object.keys(updatedFields).length === 1) { 
        // = seulement currentPassword → aucune modif
        setSuccess("Aucune modification détectée");
        setIsEditing(false);
        setUpdating(false);
        return;
      }

      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
          Accept: "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await res.json()
        : { message: await res.text() };

      if (!res.ok) {
        setError(data.message || `Erreur ${res.status}`);
        setUpdating(false);
        return;
      }

      // 🔥🔥 RECONNEXION AUTOMATIQUE POUR GARDER LA SESSION
      const loginRes = await fetch("http://localhost:8000/api/login_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: updatedFields.email ?? user.email,
          password: formData.currentPassword,
        }),
      });

      if (loginRes.ok) {
        const jwt = await loginRes.json();
        localStorage.setItem("jwt", jwt.token);
      }

      setSuccess("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    } finally {
      setUpdating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("remember");
    window.location.href = "/";
  };

  if (loading)
    return (
      <div>
        <SousChargement />
      </div>
    );

  if (!user) return <div>Vous devez être connecté</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <p className={`${theme}_subbtle-texte`}>
          Consultez et modifiez vos informations de profil
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!isEditing ? (
        <div
          className={`profile-info ${theme}_light-background ${theme}_Border`}
        >
          <div className="info-item">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <label>Nom d'utilisateur:</label>
            <p>{user.pseudo}</p>
          </div>
          <div className="profile-actions">
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
            <button className="btn-secondary" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`profile-form ${theme}_light-background ${theme}_Border`}
        >
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${theme}_subbtle-background`}
              required
            />
          </div>

          <div className="form-group">
            <label>Nom d'utilisateur:</label>
            <input
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              className={`form-input ${theme}_subbtle-background`}
              required
            />
          </div>

          <div className="form-group">
            <label>Votre Mot de passe actuel</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`form-input ${theme}_subbtle-background`}
              required
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn-primary" disabled={updating}>
              {updating ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setError("");
                setSuccess("");
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
