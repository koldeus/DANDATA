import React, { useEffect, useState } from "react";

export default function GeneralInfoSection({
  titre,
  setTitre,
  resume,
  setResume,
  pageTheme,
  setPageTheme,
  themes,
  theme,
  selectedCategories,
  setSelectedCategories,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data.member) ? data.member : []);
      })
      .catch((err) => console.error("Erreur chargement catégories:", err));
  }, []);

  const handleCategoryToggle = (categoryId) => {
    if (!Array.isArray(selectedCategories)) return;
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <section className={`form-section ${theme}_light-background ${theme}_Border`}>
      <h2>📝 Informations générales</h2>

      {/* Titre */}
      <div className="form-group">
        <label htmlFor="titre">
          Titre principal <span className="required">*</span>
        </label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Entrez le titre..."
          maxLength={200}
          required
          className={`${theme}_subbtle-background ${theme}_Border`}
        />
        <small className={`${theme}_subbtle-texte`}>{titre.length}/200</small>
      </div>

      {/* Résumé */}
      <div className="form-group">
        <label htmlFor="resume">
          Résumé <span className="required">*</span>
        </label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Résumé..."
          rows={4}
          maxLength={500}
          required
          className={`${theme}_subbtle-background ${theme}_Border`}
        />
        <small className={`${theme}_subbtle-texte`}>{resume.length}/500</small>
      </div>

      {/* Thème */}
      <div className="form-group">
        <label htmlFor="theme">
          Thème <span className="required">*</span>
        </label>
        <select
          id="theme"
          value={pageTheme || ""}
          onChange={(e) => setPageTheme(e.target.value)}
          required
          className={`${theme}_subbtle-background ${theme}_Border`}
        >
          <option value="">-- Choisir --</option>
          {(themes || []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom || t.Nom}
            </option>
          ))}
        </select>
      </div>

      {/* Catégories */}
      <div className="form-group">
        <label>
          Catégories <span className="required">*</span>
        </label>
        <div className="checkbox-group">
          {(categories || []).map((cat) => (
            <label
              key={cat.id}
              className={`checkbox-item ${theme}_subbtle-background`}
            >
              <input
                type="checkbox"
                checked={(selectedCategories || []).includes(cat.id)}
                onChange={() => handleCategoryToggle(cat.id)}
              />
              <span>{cat.Nom || cat.nom}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
