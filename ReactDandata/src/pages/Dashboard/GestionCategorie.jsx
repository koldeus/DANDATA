// ===============================
// GestionCategorie.jsx
// ===============================
import React, { useEffect, useState } from "react";
import { useAuthToken, useUser } from "../../hooks/useUser";
import SousChargement from "../../components/SousChargement/SousChargement";
import "./GestionCategorie.css";

export default function GestionCategorie({ theme }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { getToken } = useAuthToken();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        headers: { Accept: "application/ld+json" },
      });

      if (!res.ok) throw new Error("Erreur chargement catégories");
      const data = await res.json();
      setCategories(Array.isArray(data.member) ? data.member : []);
    } catch (err) {
      setError("Impossible de charger les catégories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return;
    const token = getToken();
    console.log(token)
    if (!token) return alert("Vous devez être connecté");

    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Accept: "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Nom: name }),
      });

      if (!res.ok) throw new Error();
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setName("");
      setSuccess("Catégorie créée avec succès");
    } catch (err) {
      setError("Création impossible");
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) throw new Error();
      setCategories((prev) => prev.filter((c) => extractId(c) !== id));
      setSuccess("Catégorie supprimée");
    } catch (err) {
      setError("Suppression impossible");
      console.error(err);
    }
  }

  function startEdit(cat) {
    setEditingId(extractId(cat));
    setEditName(cat.Nom || "");
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editName.trim()) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
          Accept: "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Nom: editName }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();

      setCategories((prev) =>
        prev.map((c) => (extractId(c) === id ? updated : c))
      );

      setEditingId(null);
      setEditName("");
      setSuccess("Catégorie modifiée");
    } catch (err) {
      setError("Modification impossible");
      console.error(err);
    }
  }

  function extractId(item) {
    if (item?.id) return item.id;
    if (item?.['@id']) {
      const m = item['@id'].match(/\/(\d+)$/);
      return m ? Number(m[1]) : null;
    }
    return null;
  }

  if (loading || userLoading) return <SousChargement />;

  return (
    <div className={`gestion-categorie administration ${theme}_Border ${theme}_light-background`}>
      <div className="admin-header">
        <h1>Catégories</h1>
        <p className={`${theme}_subbtle-texte`}>
          Gérez les catégories du blog
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleCreate} className={`create-form ${theme}_subbtle-background`}>
        <input
          className={`form-input ${theme}_light-background`}
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className={`btn-create-categorie ${theme}_Light-Btn`}>
          Créer
        </button>
      </form>

      <div className="categories-list">
        {categories.length === 0 ? (
          <p className={`${theme}_subbtle-texte`}>Aucune catégorie</p>
        ) : (
          categories.map((cat) => {
            const id = extractId(cat);
            return (
              <div key={id} className={`categorie-item ${theme}_Border`}>
                {editingId === id ? (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, id)}
                    className={`edit-form`}
                  >
                    <input
                      className={`form-input ${theme}_subbtle-background`}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                    <div className="form-actions">
                      <button className={`btn-primaire-categorie ${theme}_Light-Btn`}>
                        Valider
                      </button>
                      <button
                        type="button"
                        className={`btn-secondaire-categorie ${theme}_Light-Btn-inverse`}
                        onClick={() => setEditingId(null)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="categorie-item-titre">{cat.Nom}</h3>
                    <div className="categorie-actions">
                      <button
                        className={`btn-primaire-categorie ${theme}_Light-Btn-inverse`}
                        disabled={!user?.roles?.includes("ROLE_ADMIN")}
                        onClick={() => startEdit(cat)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-supp"
                        disabled={!user?.roles?.includes("ROLE_ADMIN")}
                        onClick={() => handleDelete(id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}