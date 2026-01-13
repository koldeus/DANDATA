import { useEffect, useState } from "react";

export default function ImageSelector({ onSelect, theme = "" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/images")
      .then((res) => res.json())
      .then((data) => {
        setImages(data["member"]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement images:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className={`${theme}_subbtle-texte`}>Chargement des images...</p>;

  return (
    <div
      className={`image-selector ${theme}_subbtle-background ${theme}_Border`}
    >
      {images.length === 0 ? (
        <p className={`${theme}_subbtle-texte`}>Aucune image disponible</p>
      ) : (
        images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.alt}
            onClick={() => onSelect(img)}
            className={`image-thumb ${theme}_Border`}
          />
        ))
      )}
    </div>
  );
}
