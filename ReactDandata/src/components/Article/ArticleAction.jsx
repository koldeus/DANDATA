import React from "react";
import { Share2 } from "lucide-react";
import "./ArticleAction.css";

export default function ArticleActions({ theme }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch((error) => console.log('Erreur partage', error));
    } else {
      // Fallback: copier l'URL
        navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  return (
    <div className={`article-actions ${theme}_Border`}>
      <button
        onClick={handleShare}
        className={`action-button ${theme}_Border ${theme}_texte`}
      >
        <Share2 size={20} />
        <span>Partager</span>
      </button>
    </div>
  );
}