import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { Navigate } from "react-router-dom";
import SousChargement from "../../components/SousChargement/SousChargement";
import "./Administration.css";

export default function Administration({ theme }) {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("articles");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    email: "",
    pseudo: "",
    roles: [],
  });

  if (loading) return <SousChargement />;
  if (!user || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }


  const fetchUtilisateurs = async () => {
    setLoadingData(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUtilisateurs(data["hydra:member"] || []);
      }
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEditUser = (u) => {
    setEditingUser(u);
    setUserFormData({
      email: u.email || "",
      pseudo: u.pseudo || "",
      roles: u.roles || [],
    });
    setError("");
    setSuccess("");
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
    setUserFormData({ email: "", pseudo: "", roles: [] });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setUserFormData((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(
        `http://localhost:8000/api/users/${editingUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/merge-patch+json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userFormData.email,
            pseudo: userFormData.pseudo,
            roles: userFormData.roles,
          }),
        }
      );

      if (res.ok) {
        setSuccess("Utilisateur modifié avec succès");
        setEditingUser(null);
        fetchUtilisateurs();
      } else {
        const data = await res.json();
        setError(data.message || "Erreur lors de la modification");
      }
    } catch (err) {
      setError("Erreur réseau");
      console.error(err);
    }
  };

  const handleBanUser = async (userId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir bannir cet utilisateur ? Il ne pourra plus se connecter."
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("jwt");
      const userToBan = utilisateurs.find((u) => u.id === userId);
      const newRoles = userToBan.roles.filter((r) => r !== "ROLE_VISITOR");

      const res = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/merge-patch+json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roles: newRoles,
          }),
        }
      );

      if (res.ok) {
        setSuccess("Utilisateur banni avec succès");
        fetchUtilisateurs();
      } else {
        setError("Erreur lors du bannissement");
      }
    } catch (err) {
      setError("Erreur réseau");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      setError("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }

    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ?"
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSuccess("Utilisateur supprimé avec succès");
        fetchUtilisateurs();
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur réseau");
      console.error(err);
    }
  };

  const rolesList = [
    "ROLE_VISITOR",
    "ROLE_SUBSCRIBER",
    "ROLE_AUTHOR",
    "ROLE_EDITOR",
    "ROLE_DESIGNER",
    "ROLE_DATA_PROVIDER",
    "ROLE_ADMIN",
  ];

  return (
    <div className={`administration ${theme}_subbtle-background`}>
      <div className="admin-header">
        <h1>Administration</h1>
        <p className={`${theme}_subbtle-texte`}>
          Gérez les utilisateurs de la plateforme
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Onglets */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === "utilisateurs" ? "active" : ""} ${
            theme
          }_tab-btn`}
          onClick={() => setActiveTab("utilisateurs")}
        >
          Utilisateurs ({utilisateurs.length})
        </button>
      </div>


      {/* ONGLET UTILISATEURS */}
      {activeTab === "utilisateurs" && (
        <div className={`admin-section ${theme}_subbtle-background`}>
          {loadingData ? (
            <SousChargement />
          ) : utilisateurs.length === 0 ? (
            <p className={`${theme}_subbtle-texte`}>Aucun utilisateur trouvé</p>
          ) : (
            <div className="users-list">
              {utilisateurs.map((u) => (
                <div
                  key={u.id}
                  className={`user-item ${theme}_user-card ${
                    u.id === user.id ? "current-user" : ""
                  }`}
                >
                  {editingUser?.id === u.id ? (
                    <form onSubmit={handleSaveUser} className="edit-form">
                      <div className="form-group">
                        <label>Email:</label>
                        <input
                          type="email"
                          name="email"
                          value={userFormData.email}
                          onChange={handleUserChange}
                          className={`form-input ${theme}_subbtle-background`}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Pseudo:</label>
                        <input
                          type="text"
                          name="pseudo"
                          value={userFormData.pseudo}
                          onChange={handleUserChange}
                          className={`form-input ${theme}_subbtle-background`}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Rôles:</label>
                        <div className="roles-checkboxes">
                          {rolesList.map((role) => (
                            <label key={role} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={userFormData.roles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                              />
                              {role}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={handleCancelEditUser}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="user-info">
                        <div className="user-header">
                          <h3>{u.pseudo}</h3>
                          {u.id === user.id && (
                            <span className="badge-current">Vous</span>
                          )}
                        </div>
                        <p className={`${theme}_subbtle-texte`}>
                          Email: <strong>{u.email}</strong>
                        </p>
                        <div className="user-roles">
                          {u.roles?.map((role) => (
                            <span key={role} className={`role-badge ${role}`}>
                              {role.replace("ROLE_", "")}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="user-actions">
                        {u.id !== user.id && (
                          <>
                            <button
                              className="btn-primary"
                              onClick={() => handleEditUser(u)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn-warning"
                              onClick={() => handleBanUser(u.id)}
                            >
                              Bannir
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
