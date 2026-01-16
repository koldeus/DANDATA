import React, { useState, useEffect, useRef } from "react";
import { useAuthToken, useUser } from "../../hooks/useUser";
import SousChargement from "../../components/SousChargement/SousChargement";
import DOMPurify from "dompurify";
import { uploadImageFile } from "../../components/ImageUpload/ImageUpload";
import GeneralInfoSection from "./FormArticle/GeneralInfoSection";
import MainImageSection from "./FormArticle/MainImageSection";
import ContentSection from "./FormArticle/ContentSection";
import BlocList from "./FormArticle/BlocList";
import "./form-article.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "p", "br", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
};

const normalizeOrder = (blocs) =>
  blocs.map((bloc, index) => ({ ...bloc, ordre: index + 1 }));

export default function FormeArticle({ theme }) {
  const { getToken } = useAuthToken();
  const { user, loading: userLoading } = useUser();

  // États
  const [titre, setTitre] = useState("");
  const [resume, setResume] = useState("");
  const [imagePrincipale, setImagePrincipale] = useState(null);
  const [pageTheme, setPageTheme] = useState("");
  const [blocs, setBlocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [themes, setThemes] = useState([]);
  const [metadonnees, setMetadonnees] = useState([]);
  const [imagesServeur, setImagesServeur] = useState([]);
  const [variableCache, setVariableCache] = useState({});
  const [mainImageMode, setMainImageMode] = useState("upload");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isMountedRef = useRef(true);
  const fetchedVariablesRef = useRef(new Set());

  // 1. Chargement des données initiales
  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      try {
        setDataLoaded(false);
        const [themesRes, metaRes, imagesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/themes`),
          fetch(`${API_BASE_URL}/api/metadonnees`),
          fetch(`${API_BASE_URL}/api/images`),
        ]);

        if (isMountedRef.current) {
          if (themesRes.ok) {
            const themesData = await themesRes.json();
            setThemes(
              Array.isArray(themesData.member) ? themesData.member : []
            );
          }

          if (metaRes.ok) {
            const metaData = await metaRes.json();
            setMetadonnees(
              Array.isArray(metaData.member) ? metaData.member : []
            );
          }

          if (imagesRes.ok) {
            const imagesData = await imagesRes.json();
            setImagesServeur(
              Array.isArray(imagesData.member) ? imagesData.member : []
            );
          }
          setDataLoaded(true);
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
        if (isMountedRef.current) {
          setError("Impossible de charger les données");
        }
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 2. Chargement des variables
  useEffect(() => {
    if (!dataLoaded) return; 

    const fetchVariables = async () => {
      const missingIRIs = new Set();

      blocs.forEach((bloc) => {
        if (bloc.type === "graphique" && bloc.graphique.metadonnees) {
          const metadata = metadonnees.find(
            (m) =>
              `${API_BASE_URL}/api/metadonnees/${m.id}` ===
              bloc.graphique.metadonnees
          );
          if (metadata?.variables) {
            metadata.variables.forEach((iri) => {
              if (!fetchedVariablesRef.current.has(iri)) {
                missingIRIs.add(iri);
              }
            });
          }
        }
      });

      if (missingIRIs.size === 0) return;

      try {
        const results = await Promise.all(
          [...missingIRIs].map(async (iri) => {
            const res = await fetch(`${API_BASE_URL}${iri}`);
            if (!res.ok) return null;
            const data = await res.json();
            return { iri, nom: data.nom };
          })
        );

        setVariableCache((prev) => {
          const next = { ...prev };
          results.forEach((r) => {
            if (r) {
              next[r.iri] = r.nom;
              fetchedVariablesRef.current.add(r.iri);
            }
          });
          return next;
        });
      } catch (err) {
        console.error("Erreur chargement variables :", err);
      }
    };

    fetchVariables();
  }, [blocs, metadonnees, dataLoaded]);

  // Gestion des blocs
  const addBloc = (type) => {
    if (!dataLoaded) {
      setError("⏳ Veuillez attendre le chargement des données");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setBlocs((prev) =>
      normalizeOrder([
        ...prev,
        {
          id: Date.now(),
          type,
          texte: "",
          niveau: 2,
          images: [],
          imageMode: "upload",
          graphique: {
            type: "bar",
            metadonnees: null,
            variables: [],
            titre: "",
          },
        },
      ])
    );
  };

  const updateBloc = (id, data) => {
    setBlocs((prev) =>
      normalizeOrder(prev.map((b) => (b.id === id ? { ...b, ...data } : b)))
    );
  };

  const removeBloc = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
      return;
    }
    setBlocs((prev) => normalizeOrder(prev.filter((b) => b.id !== id)));
  };

  const moveBloc = (index, direction) => {
    setBlocs((prev) => {
      const copy = [...prev];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return prev;
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return normalizeOrder(copy);
    });
  };

  // Validation
  const validateForm = () => {
    if (!titre.trim() || titre.trim().length < 5) {
      setError("❌ Le titre doit contenir au moins 5 caractères");
      return false;
    }

    if (!pageTheme) {
      setError("❌ Veuillez sélectionner un thème");
      return false;
    }

    if (!resume.trim()) {
      setError("❌ Le résumé est requis");
      return false;
    }

    if (blocs.length === 0) {
      setError("❌ Ajoutez au moins un bloc de contenu");
      return false;
    }

    for (const bloc of blocs) {
      if (
        (bloc.type === "titre" || bloc.type === "texte") &&
        !bloc.texte.trim()
      ) {
        setError(`❌ Le bloc ${bloc.type} #${bloc.ordre} est vide`);
        return false;
      }

      if (bloc.type === "graphique") {
        if (!bloc.graphique.metadonnees) {
          setError(
            `❌ Sélectionnez un dataset pour le graphique #${bloc.ordre}`
          );
          return false;
        }
        if (
          !bloc.graphique.variables ||
          bloc.graphique.variables.length === 0
        ) {
          setError(
            `❌ Sélectionnez au moins une variable pour le graphique #${bloc.ordre}`
          );
          return false;
        }
      }
    }

    return true;
  };

  // Soumission
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    if (!user || !user.id) {
      setError("❌ Utilisateur non authentifié");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Impossible de récupérer le token d'authentification");
      }

      // Upload des nouvelles images si nécessaire
      let uploadedBlocImages = {};

      for (const bloc of blocs) {
        if (
          bloc.type === "image" &&
          bloc.images &&
          Array.isArray(bloc.images)
        ) {
          const processedImages = [];
          for (const img of bloc.images) {
            if (img.id) {
              processedImages.push(img);
            } else if (img instanceof File) {
              try {
                const uploadedImg = await uploadImageFile(
                  img,
                  token,
                  API_BASE_URL
                );
                processedImages.push(uploadedImg);
              } catch (err) {
                console.error("Erreur upload image bloc:", err);
                setError(`❌ Erreur upload image: ${err.message}`);
                setLoading(false);
                return;
              }
            }
          }
          uploadedBlocImages[bloc.id] = processedImages;
        }
      }

      // Construire le payload
      const payload = {
        titre: titre.trim(),
        resume: resume.trim(),
        auteur: `${API_BASE_URL}/api/users/${user.id}`,
        theme: `${API_BASE_URL}/api/themes/${pageTheme}`,
        categories: selectedCategories.map(
          (id) => `${API_BASE_URL}/api/categories/${id}`
        ),
        imagePrincipale:
          imagePrincipale && imagePrincipale.id
            ? `${API_BASE_URL}/api/images/${imagePrincipale.id}`
            : null,
        blocs: blocs
          .map((bloc) => {
            const blocData = {
              type: bloc.type,
              ordre: bloc.ordre,
              texte: bloc.texte ? sanitizeHTML(bloc.texte) : "",
            };

            if (bloc.type === "titre") {
              blocData.niveau = parseInt(bloc.niveau, 10);
            }

            if (bloc.type === "image") {
              const imagesToUse =
                uploadedBlocImages[bloc.id] || bloc.images || [];

              if (imagesToUse.length > 0) {
                blocData.images = imagesToUse
                  .filter((img) => img && img.id)
                  .map((img) => `${API_BASE_URL}/api/images/${img.id}`);
              }
            }

            if (bloc.type === "graphique") {
              blocData.graphique = {
                type: bloc.graphique.type,
                metadonnees: bloc.graphique.metadonnees,
                variables: bloc.graphique.variables,
                titre: bloc.graphique.titre,
                NbLigne:bloc.graphique.NbLigne
              };
            }

            return blocData;
          })
          .filter((blocData) => {
            if (
              blocData.type === "titre" ||
              blocData.type === "texte" ||
              blocData.type === "graphique"
            ) {
              return true;
            }
            if (blocData.type === "image") {
              return blocData.images && blocData.images.length > 0;
            }
            return true;
          }),
      };


      const res = await fetch(`${API_BASE_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            errorData["hydra:description"] ||
            `Erreur HTTP: ${res.status}`
        );
      }

      const responseData = await res.json();
      setSuccess("✅ Article créé avec succès !");

      setTimeout(() => {
        setTitre("");
        setResume("");
        setBlocs([]);
        setImagePrincipale(null);
        setPageTheme("");
        setSelectedCategories([]);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Erreur création article:", err);
      console.error("Stack trace:", err.stack);
      setError(`❌ ${err.message || "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  // Afficher le chargement tant que les données ne sont pas chargées
  if (userLoading || !dataLoaded) {
    return <SousChargement />;
  }

  return (
    <div className={`forme-article ${theme}`}>
      {loading && <SousChargement />}

      <div className="forme-header">
        <h1>✍️ Créer un article</h1>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      <GeneralInfoSection
        titre={titre}
        setTitre={setTitre}
        resume={resume}
        setResume={setResume}
        pageTheme={pageTheme}
        setPageTheme={setPageTheme}
        themes={themes}
        theme={theme}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <MainImageSection
        imagePrincipale={imagePrincipale}
        setImagePrincipale={setImagePrincipale}
        mainImageMode={mainImageMode}
        setMainImageMode={setMainImageMode}
        imagesServeur={imagesServeur}
        theme={theme}
      />

      <ContentSection
        addBloc={addBloc}
        blocsLength={blocs.length}
        dataLoaded={dataLoaded}
      />

      <BlocList
        blocs={blocs}
        theme={theme}
        updateBloc={updateBloc}
        removeBloc={removeBloc}
        moveBloc={moveBloc}
        metadonnees={metadonnees}
        variableCache={variableCache}
        imagesServeur={imagesServeur}
      />

      <div className="form-actions">
        <button
          type="button"
          className={`submit-btn ${theme}_Light-Btn`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Publication..." : "🚀 Publier"}
        </button>
      </div>
    </div>
  );
}