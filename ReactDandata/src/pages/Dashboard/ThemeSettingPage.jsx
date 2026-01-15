import React, { useEffect, useState } from "react";
import { useAuthToken } from "../../hooks/useUser";
import SousChargement from "../../components/SousChargement/SousChargement";
import { useNavigate } from "react-router-dom";

import "./ThemeSettingPage.css";

export default function ThemePage({ theme }) {
  const { getToken } = useAuthToken();

  const [articles, setArticles] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [site, setSite] = useState(null);
  const [savingSite, setSavingSite] = useState(false);
  const [selectedSiteTheme, setSelectedSiteTheme] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Articles
        const aRes = await fetch("http://localhost:8000/api/articles");
        if (!aRes.ok)
          throw new Error(`Erreur chargement articles : ${aRes.status}`);

        const rawArticles = await aRes.json();
        const aData = Array.isArray(rawArticles)
          ? rawArticles
          : Array.isArray(rawArticles.data)
          ? rawArticles.data
          : rawArticles["member"] || rawArticles.member || [];

        let tData = [];
        try {
          const tRes = await fetch("http://localhost:8000/api/themes");
          if (tRes.ok) {
            const rawThemes = await tRes.json();
            const list = Array.isArray(rawThemes)
              ? rawThemes
              : Array.isArray(rawThemes.data)
              ? rawThemes.data
              : rawThemes["member"] || rawThemes.member || [];

            tData = list.map((t) => {
              const iri =
                t["@id"] ||
                (t.id ? `/api/themes/${t.id}` : null) ||
                (typeof t === "string" ? t : null);
              const name =
                t.Nom ||
                t.nom ||
                t.name ||
                (typeof t === "string" ? t : "Unnamed");
              const id = t.id || (iri ? iri.split("/").pop() : null);
              return { id, name, iri };
            });
          }
        } catch (e) {
          // silencieux
        }

        if (!tData.length) {
          const derived = Array.from(
            new Set(
              aData
                .map((it) =>
                  typeof it.theme === "string" ? it.theme : it.theme?.name
                )
                .filter(Boolean)
            )
          );

          tData = derived.length
            ? derived.map((n, idx) => ({ id: idx + 1, name: n, iri: n }))
            : ["Général", "Actualités", "Culture", "Science"].map((n, idx) => ({
                id: idx + 1,
                name: n,
                iri: n,
              }));
        }

        setArticles(aData);
        setThemes(tData);

        try {
          const sRes = await fetch("http://localhost:8000/api/sites");
          if (sRes.ok) {
            const raw = await sRes.json();
            const list = Array.isArray(raw)
              ? raw
              : raw["member"] || raw.member || raw.member || raw.data || [];
            const first = Array.isArray(list) ? list[0] : list;
            const siteObj = first || (raw.member && raw.member[0]) || null;
            if (siteObj) {
              setSite(siteObj);
              const currentIri =
                typeof siteObj.Theme === "string"
                  ? siteObj.Theme
                  : siteObj.Theme?.["@id"] ||
                    (siteObj.Theme?.id
                      ? `/api/themes/${siteObj.Theme.id}`
                      : "");
              setSelectedSiteTheme(currentIri || "");
            }
          }
        } catch (e) {}
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur réseau");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeTheme = async (articleId, newTheme) => {
    setError(null);

    const prev = articles.map((a) => ({ ...a }));
    setArticles((list) =>
      list.map((a) => (a.id === articleId ? { ...a, theme: newTheme } : a))
    );
    setSavingIds((s) => new Set(s).add(articleId));

    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:8000/api/themes/articles/${articleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/merge-patch+json", 
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ theme: newTheme }),
        }
      );

      if (!res.ok) throw new Error(`Erreur sauvegarde : ${res.status}`);

      try {
        const rawUpdated = await res.json();
        const updated = Array.isArray(rawUpdated) ? rawUpdated[0] : rawUpdated;
        setArticles((list) =>
          list.map((a) => (a.id === articleId ? updated : a))
        );
      } catch {
        // no body
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de la sauvegarde");
      setArticles(prev);
    } finally {
      setSavingIds((s) => {
        const copy = new Set(s);
        copy.delete(articleId);
        return copy;
      });
    }
  };

  const handleSaveSiteTheme = async () => {
    if (!site) return;
    setError(null);
    setSavingSite(true);

    try {
      const token = getToken();
      const body = { Theme: selectedSiteTheme || null };

      const res = await fetch(`http://localhost:8000${site["@id"]}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Erreur sauvegarde site : ${res.status}`);

      try {
        const updated = await res.json();
        setSite(updated);
        const currentIri =
          typeof updated.Theme === "string"
            ? updated.Theme
            : updated.Theme?.["@id"] ||
              (updated.Theme?.id ? `/api/themes/${updated.Theme.id}` : "");
        setSelectedSiteTheme(currentIri || "");
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de la sauvegarde du site");
    } finally {
      setSavingSite(false);

      window.location.reload();
    }
  };

  if (loading) return <SousChargement />;

  return (
    <div style={{ padding: 16 }}>
      <h2 className="titreTheme">Paramètres des thèmes — Articles & Site</h2>

      {error && (
        <div style={{ color: "red", marginBottom: 8 }}>Erreur : {error}</div>
      )}

      <div style={{ marginBottom: 12 }}>
        <strong>Thèmes disponibles :</strong>{" "}
        {themes.map((t) => t.name).join(", ")}
      </div>

      <div style={{ marginBottom: 18 }}>
        <h3 className="sousTitreThem">Thème du site</h3>
        {!site ? (
          <div>Aucun site trouvé</div>
        ) : (
          <div
            className={`choixTheme ${theme}_light-background`}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <select
              className={`selectThemeSite ${theme}_light-background ${theme}_border`}
              value={selectedSiteTheme}
              onChange={(e) => setSelectedSiteTheme(e.target.value)}
              disabled={!themes.length || savingSite}
            >
              {themes.map((t) => (
                <option
                  key={t.iri || t.id}
                  value={t.iri || t.name}
                  className={`optionTheme ${theme}_subbtle-texte`}
                >
                  {t.name}
                </option>
              ))}
            </select>

            <button
              className={`buttonSaveTheme ${theme}_Light-Btn-inverse `}
              onClick={handleSaveSiteTheme}
              disabled={savingSite}
            >
              {savingSite ? "Enregistrement…" : "Sauvegarder le thème du site"}
            </button>
          </div>
        )}
      </div>

      <table
        className={`tableTheme  ${theme}_light-background`}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead className={`tabTheme  ${theme}_light-background`}>
          <tr className="trTheme  ${theme}_light-background">
            <th
              className={`optionTexte  ${theme}_subbtle-texte`}
              style={{ textAlign: "left", padding: 8 }}
            >
              Titre
            </th>
            <th
              className={`optionTexte  ${theme}_subbtle-texte`}
              style={{ textAlign: "left", padding: 8 }}
            >
              Thème actuel
            </th>
            <th
              className={`optionTexte  ${theme}_subbtle-texte`}
              style={{ textAlign: "left", padding: 8 }}
            >
              Modifier
            </th>
          </tr>
        </thead>
        <tbody className="tableauTheme">
          {articles.map((article) => (
            <tr
              key={article.id}
              style={{ borderTop: "1px solid rgba(204, 204, 204, 1)" }}
            >
              {/* Titre */}
              <td className="rowTheme" style={{ padding: 8 }}>
                {article.title || article.nom || `#${article.id}`}
              </td>

              {/* Thème actuel */}
              <td
                className={`rowTheme ${theme}_light-background`}
                style={{ padding: 8 }}
              >
                <select
                  className={`selectThemeArticle ${theme}_light-background ${theme}_border`}
                  value={article.theme} // l'IRI actuel
                  onChange={(e) =>
                    handleChangeTheme(article.id, e.target.value)
                  }
                  disabled={savingIds.has(article.id) || themes.length === 0}
                >
                  {themes.map((t) => (
                    <option key={t.iri || t.id} value={t.iri}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Indicateur de sauvegarde */}
              <td className="rowTheme" style={{ padding: 8 }}>
                {savingIds.has(article.id) && (
                  <button
                    className={`buttonSaveTheme ${theme}_Light-Btn-inverse`}
                    style={{ marginLeft: 8 }}
                  >
                    Enregistrement…
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
