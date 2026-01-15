import React, { useEffect, useState } from 'react';
import './RatingsDisplay.css';

export default function RatingsDisplay({ article, theme }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      if (!article?.id) return;

      try {
        const token = localStorage.getItem("jwt");
        const headers = {
          "Accept": "application/ld+json",
        };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Récupérer toutes les notes pour cet article
        const res = await fetch(
          `http://localhost:8000/api/article_notes?article=${article.id}`,
          { headers }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data)
        
        // Compter les notes par étoile
        const noteCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        
        if (data["member"]) {
          data["member"].forEach(item => {
            const note = Math.round(item.note);
            if (note >= 1 && note <= 5) {
              noteCounts[note]++;
            }
          });
        }

        // Convertir en tableau pour le composant
        const ratingsArray = [5, 4, 3, 2, 1].map(star => ({
          stars: star,
          count: noteCounts[star]
        }));

        setRatings(ratingsArray);
      } catch (err) {
        console.error("Erreur chargement évaluations:", err);
        // En cas d'erreur, afficher des données vides
        setRatings([
          { stars: 5, count: 0 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [article?.id]);

  if (loading) {
    return (
      <div className="ratings-container">
        <div className="ratings-loading">Chargement des évaluations...</div>
      </div>
    );
  }

  const total = ratings.reduce((sum, r) => sum + r.count, 0);
  
  // Si aucune évaluation, afficher un message
  if (total === 0) {
    return (
      <div className="ratings-container">
        <div className="ratings-header">
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <h2>Évaluations des lecteurs</h2>
        </div>
        <div className="no-ratings">
          <p>Aucune évaluation pour le moment</p>
          <p className="no-ratings-subtitle">Soyez le premier à noter cet article !</p>
        </div>
      </div>
    );
  }

  const average = ratings.reduce((sum, r) => sum + (r.stars * r.count), 0) / total;
  const maxCount = Math.max(...ratings.map(r => r.count));

  return (
    <div className="ratings-container">
      <div className="ratings-header">
        <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h2>Évaluations des lecteurs</h2>
      </div>

      <div className="ratings-content">
        {/* Section gauche : Score moyen */}
        <div className="average-section">
          <div className="average-score">{average.toFixed(1)}</div>
          <div className="stars-display">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.round(average) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
          </div>
          <div className="total-reviews">Basé sur {total} évaluation{total > 1 ? 's' : ''}</div>
        </div>

        {/* Section droite : Barres de distribution */}
        <div className="distribution-section">
          {ratings.map((rating) => (
            <div key={rating.stars} className="rating-row">
              <div className="rating-label">
                {rating.stars} <span className="star-icon">★</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: rating.count > 0 ? `${(rating.count / maxCount) * 100}%` : '0%' }}
                />
              </div>
              <div className="rating-count">{rating.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}