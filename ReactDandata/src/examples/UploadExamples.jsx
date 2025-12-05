import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import CSVUpload from './components/CSVUpload';
import BlockRating from './components/BlockRating';
import { useUser } from './hooks/useUser';
import { useUpload, useRating } from './hooks/useUpload';

/**
 * Exemple 1 : Composant de formulaire d'article complet
 */
export function ArticleFormExample() {
  const { token, user } = useUser();
  const { uploadImage } = useUpload();
  
  const [formData, setFormData] = useState({
    titre: '',
    slug: '',
    resume: '',
    imagePrincipale: null,
    datasets: [],
  });

  const handleImageSelected = (images) => {
    if (images.length > 0) {
      setFormData({
        ...formData,
        imagePrincipale: images[0],
      });
    }
  };

  const handleDatasetUploaded = (dataset) => {
    setFormData({
      ...formData,
      datasets: [...formData.datasets, dataset],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envoyer les données de l'article à l'API
    const articleData = {
      titre: formData.titre,
      slug: formData.slug,
      resume: formData.resume,
      auteur: `/api/users/${user.id}`,
      theme: '/api/themes/1', // À adapter
      imagePrincipale: formData.imagePrincipale?.['@id'] || null,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(articleData),
        }
      );

      if (response.ok) {
        alert('Article créé avec succès!');
        setFormData({
          titre: '',
          slug: '',
          resume: '',
          imagePrincipale: null,
          datasets: [],
        });
      }
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="article-form-container">
      <h1>Créer un Nouvel Article</h1>

      <form onSubmit={handleSubmit}>
        {/* Champs de base */}
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input
            id="titre"
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            placeholder="Titre de l'article"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="mon-article"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="resume">Résumé</label>
          <textarea
            id="resume"
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            placeholder="Brève description"
            rows="3"
          />
        </div>

        {/* Upload image principale */}
        <div className="form-group">
          <label>Image Principale</label>
          {formData.imagePrincipale ? (
            <div className="selected-image">
              <img src={formData.imagePrincipale.url} alt="Aperçu" />
              <p>{formData.imagePrincipale.alt}</p>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imagePrincipale: null })}
              >
                Changer
              </button>
            </div>
          ) : (
            <ImageUpload
              token={token}
              maxFiles={1}
              onImageUploaded={handleImageSelected}
            />
          )}
        </div>

        {/* Upload CSV/Données */}
        <div className="form-group">
          <label>Données Associées</label>
          <CSVUpload
            token={token}
            onDatasetUploaded={handleDatasetUploaded}
          />
          {formData.datasets.length > 0 && (
            <div className="datasets-summary">
              <h4>Datasets sélectionnés:</h4>
              <ul>
                {formData.datasets.map((ds) => (
                  <li key={ds.id}>{ds.nom} ({ds.preview?.rowCount} lignes)</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Créer l'Article
        </button>
      </form>
    </div>
  );
}

/**
 * Exemple 2 : Composant d'affichage d'article avec notation
 */
export function ArticleViewExample({ articleSlug }) {
  const { token, user } = useUser();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchArticleRatings, calculateAverage, ratings } = useRating();
  const [averageRating, setAverageRating] = useState(0);

  // Charger l'article
  React.useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/articles/${articleSlug}`
        );
        const data = await response.json();
        setArticle(data);

        // Charger les notes
        const allRatings = await fetchArticleRatings(data.id);
        setAverageRating(calculateAverage(allRatings));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleSlug]);

  if (loading) return <div>Chargement...</div>;
  if (!article) return <div>Article non trouvé</div>;

  return (
    <article className="article-view">
      {/* Header */}
      <header className="article-header">
        {article.imagePrincipale && (
          <img
            src={article.imagePrincipale.url}
            alt={article.titre}
            className="featured-image"
          />
        )}
        <h1>{article.titre}</h1>
        <div className="article-meta">
          <span>Par {article.auteur.pseudo}</span>
          <span>Thème: {article.theme.Nom}</span>
        </div>
        <p className="resume">{article.resume}</p>
      </header>

      {/* Contenu avec blocs */}
      <div className="article-content">
        {article.blocs && article.blocs.map((bloc, index) => (
          <section key={bloc.id} className={`bloc bloc-type-${bloc.type}`}>
            {/* Titres */}
            {bloc.titres && bloc.titres.map((titre) => (
              <Heading key={titre.id} niveau={titre.Niveau} texte={titre.Titre} />
            ))}

            {/* Textes */}
            {bloc.textes && bloc.textes.map((texte) => (
              <p key={texte.id} className="bloc-texte">{texte.titre}</p>
            ))}

            {/* Images */}
            {bloc.images && bloc.images.map((image) => (
              <figure key={image.id} className="bloc-image">
                <img src={image.url} alt={image.alt} />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}

            {/* Graphiques */}
            {bloc.graphiques && bloc.graphiques.map((graphique) => (
              <div key={graphique.id} className="bloc-graphique">
                <h4>{graphique.Titre}</h4>
                <p>Type: {graphique.Type}</p>
                {/* Votre composant de graphique ici */}
              </div>
            ))}

            {/* Note du bloc */}
            {bloc.type === 'texte' && (
              <BlockRating
                blockId={bloc.id}
                articleId={article.id}
                token={token}
              />
            )}
          </section>
        ))}
      </div>

      {/* Rating global */}
      <aside className="article-sidebar">
        <div className="rating-widget">
          <h3>Votre Avis</h3>
          <div className="current-rating">
            <p className="rating-value">{averageRating}/5</p>
            <p className="rating-count">({article.nombreNotes} avis)</p>
          </div>

          {user && (
            <BlockRating
              articleId={article.id}
              token={token}
              currentRating={0}
              onRatingSubmit={(rating) => {
                console.log('Article noté:', rating);
              }}
            />
          )}
        </div>

        {/* Catégories */}
        {article.categories && article.categories.length > 0 && (
          <div className="categories">
            <h4>Catégories</h4>
            <ul>
              {article.categories.map((cat) => (
                <li key={cat.id}>
                  <a href={`/categories/${cat.id}`}>{cat.Nom}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </article>
  );
}

/**
 * Composant auxiliaire: Heading
 */
function Heading({ niveau, texte }) {
  const Tag = `h${Math.min(6, Math.max(1, niveau + 1))}`;
  return <Tag>{texte}</Tag>;
}

/**
 * Exemple 3 : Composant de gestion des uploads (Data Provider)
 */
export function DataProviderExample() {
  const { token } = useUser();
  const { uploadCSV, parseCSV, isLoading, error } = useUpload();
  const [datasets, setDatasets] = useState([]);

  const handleDatasetUpload = async (dataset) => {
    setDatasets([...datasets, dataset]);
  };

  return (
    <div className="data-provider-container">
      <h1>Gestionnaire de Données</h1>

      <section className="upload-section">
        <h2>Ajouter un Dataset</h2>
        <CSVUpload
          token={token}
          onDatasetUploaded={handleDatasetUpload}
          onError={(err) => console.error(err)}
        />
      </section>

      {datasets.length > 0 && (
        <section className="datasets-section">
          <h2>Datasets Uploadés ({datasets.length})</h2>
          <div className="datasets-grid">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

/**
 * Composant auxiliaire: DatasetCard
 */
function DatasetCard({ dataset }) {
  return (
    <div className="dataset-card">
      <h3>{dataset.nom}</h3>
      <div className="dataset-stats">
        <span>{dataset.preview?.rowCount || '?'} lignes</span>
        <span>{dataset.preview?.columnCount || '?'} colonnes</span>
      </div>
      <div className="dataset-variables">
        <h4>Variables ({dataset.variables?.length || 0})</h4>
        <ul>
          {dataset.variables?.slice(0, 5).map((variable, index) => (
            <li key={index}>
              <span
                className="var-color"
                style={{ backgroundColor: variable.color }}
              />
              <span className="var-name">{variable.nom}</span>
              <span className="var-type">
                {variable.isNumeric ? '📊' : '📝'}
              </span>
            </li>
          ))}
          {dataset.variables?.length > 5 && (
            <li className="more">+{dataset.variables.length - 5} autres</li>
          )}
        </ul>
      </div>
    </div>
  );
}

/**
 * Exemple 4 : Composant de gestion des images
 */
export function ImageManagerExample() {
  const { token } = useUser();
  const [images, setImages] = useState([]);

  const handleImagesUpload = (newImages) => {
    setImages([...images, ...newImages]);
  };

  return (
    <div className="image-manager">
      <h1>Gestionnaire d'Images</h1>

      <ImageUpload
        token={token}
        onImageUploaded={handleImagesUpload}
        multiple={true}
        maxFiles={10}
      />

      {images.length > 0 && (
        <div className="images-library">
          <h2>Bibliothèque ({images.length})</h2>
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <img src={image.url} alt={image.alt} />
                <p>{image.alt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Styles CSS pour les exemples
 */
const styles = `
  .article-form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .selected-image {
    border: 2px solid #4299e1;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }

  .selected-image img {
    max-width: 200px;
    margin-bottom: 12px;
  }

  .datasets-summary {
    margin-top: 12px;
    padding: 12px;
    background: #f0f0f0;
    border-radius: 4px;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #4299e1;
    color: white;
  }

  .btn-primary:hover {
    background: #3182ce;
  }

  .article-view {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .article-header {
    margin-bottom: 40px;
  }

  .featured-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .article-content {
    margin-bottom: 40px;
  }

  .bloc {
    margin-bottom: 30px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .bloc-image img {
    max-width: 100%;
    height: auto;
  }

  .article-sidebar {
    max-width: 300px;
    margin: 40px 0 0 0;
  }

  .rating-widget {
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .categories ul {
    list-style: none;
    padding: 0;
  }

  .categories li {
    margin-bottom: 8px;
  }

  .categories a {
    color: #4299e1;
    text-decoration: none;
  }

  .datasets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .dataset-card {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
  }

  .dataset-stats {
    display: flex;
    gap: 12px;
    margin: 12px 0;
  }

  .dataset-stats span {
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .dataset-variables ul {
    list-style: none;
    padding: 0;
  }

  .dataset-variables li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .var-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .image-card {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  .image-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .image-card p {
    padding: 8px;
    font-size: 12px;
  }
`;

export default {
  ArticleFormExample,
  ArticleViewExample,
  DataProviderExample,
  ImageManagerExample,
};
