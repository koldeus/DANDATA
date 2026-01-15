





import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

export default function ArticleNotes({ article, theme }) {
  const [userNote, setUserNote] = useState(0);
  const [noteId, setNoteId] = useState(null);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const loadUserNote = async () => {
      if (!article?.id || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("jwt");
        const headers = {
          "Accept": "application/ld+json",
        };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Vérifier d'abord que le backend est accessible
        const backendUrl = "http://localhost:8000/api/article_notes";
        console.log(`Tentative de chargement: ${backendUrl}?article=${article.id}&user=${user.id}`);

        const res = await fetch(
          `${backendUrl}?article=${article.id}&user=${user.id}`,
          {
            headers: headers,
          }
        );

        if (!res.ok) {
          console.warn(`Réponse non-OK: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (data["member"] && data["member"].length > 0) {
          const existingNote = data["member"][0];
          setUserNote(existingNote.note);
          setNoteId(existingNote.id);

        } else {
          console.log("Aucune note existante pour cet article");
        }
      } catch (err) {
        console.error("Erreur chargement note:", err);
        console.error("Type d'erreur:", err.name);
        
        // Gestion spécifique des erreurs CORS
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          console.error("❌ Erreur CORS ou serveur inaccessible.");
          console.error("💡 Vérifiez que nelmio/cors-bundle est configuré dans Symfony");
          setError("Problème de connexion au serveur");
          setTimeout(() => setError(null), 5000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserNote();
  }, [article?.id, user?.id]);

  const sendNote = async (value) => {
    if (!user || !user.id) {
      setError("Vous devez être connecté pour noter");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const previousNote = userNote;
    setUserNote(value);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/ld+json",
        "Accept": "application/ld+json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("🔍 Debug - User ID:", user.id);
      console.log("🔍 Debug - Note ID:", noteId);
      console.log("🔍 Debug - Token:", token ? "présent" : "absent");

      let res;
      
      // Si une note existe déjà, on la met à jour (PATCH)
      if (noteId) {
        console.log("📝 Tentative PATCH sur note ID:", noteId);
        res = await fetch(`http://localhost:8000/api/article_notes/${noteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/merge-patch+json",
            "Accept": "application/ld+json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
          body: JSON.stringify({
            note: value,
          }),
        });
      } else {
        // Sinon on crée une nouvelle note (POST)
        console.log("✨ Tentative POST nouvelle note");
        res = await fetch(`http://localhost:8000/api/article_notes`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            article: `/api/articles/${article.id}`,
            user: `/api/users/${user.id}`,
            note: value,
          }),
        });
      }

      if (!res.ok) {
        setUserNote(previousNote);
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("Erreur lors de l'envoi de la note:", errorData);
          
          const errorMessage = 
            errorData["description"] || 
            errorData["description"] || 
            errorData["detail"] ||
            "Erreur lors de l'enregistrement";
          setError(errorMessage);
        } else {
          const text = await res.text();
          console.error(`Erreur ${res.status}:`, text.substring(0, 200));
          setError(`Erreur ${res.status}: Une erreur s'est produite`);
        }
        setTimeout(() => setError(null), 3000);
      } else {
        // Récupérer l'ID de la note créée
        const responseData = await res.json();
        if (responseData.id) {
          setNoteId(responseData.id);
        }
        console.log("Note enregistrée avec succès");
      }
    } catch (err) {
      setUserNote(previousNote);
      console.error("Erreur:", err);
      setError("Impossible de sauvegarder la note");
      setTimeout(() => setError(null), 3000);
    }
  };
  

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.starsWrapper}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{
              ...styles.star,
              ...(value <= (hover ?? userNote) ? styles.starFilled : {}),
              ...(hover === value ? styles.starHover : {}),
            }}
            onClick={() => sendNote(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
          >
            ★
          </span>
        ))}
      </div>
      <span style={styles.noteValue}>
        {userNote > 0 ? `${userNote}/5` : "Notez cet article"}
      </span>
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
  },
  starsWrapper: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    fontSize: '32px',
    color: '#d1d5db',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  starFilled: {
    color: '#fbbf24',
    textShadow: '0 2px 4px rgba(251, 191, 36, 0.3)',
  },
  starHover: {
    transform: 'scale(1.2)',
  },
  noteValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    marginTop: '4px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '8px',
    border: '1px solid #fecaca',
    animation: 'slideIn 0.3s ease',
  },
};

// Add animation keyframes
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  } catch (e) {
    // Ignore if already exists
  }
}