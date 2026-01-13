import React, { useCallback } from "react";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ImageSelector({
  blocId,
  isMainImage = false,
  mode,
  setMode,
  currentImage,
  onImageChange,
  imagesServeur,
  theme
}) {
  const handleModeChange = (newMode) => {
    setMode(newMode);
    onImageChange(isMainImage ? null : []);
  };

  const handleExistingImageToggle = useCallback(
    (image) => {
      const isSameImage =
        currentImage?.id === image.id ||
        (Array.isArray(currentImage) && currentImage[0]?.id === image.id);

      if (isSameImage) {
        onImageChange(isMainImage ? null : []);
      } else {
        onImageChange(isMainImage ? image : [image]);
      }
    },
    [currentImage, isMainImage, onImageChange]
  );

  const buildImageUrl = useCallback((img) => {
    let url = img.contentUrl || img.url || img.fichier;
    return url && !url.startsWith("http") ? `${API_BASE_URL}/${url}` : url;
  }, []);

  const displayImage = Array.isArray(currentImage)
    ? currentImage[0]
    : currentImage;

  return (
    <div className={`image-selector ${theme}`}>
      <div className="image-mode-tabs">
        <button
          type="button"
          className={`${mode === "upload" ? "active" : ""} ${theme}_image-form-Btn`}
          onClick={() => handleModeChange("upload")}
        >
          📤 Upload
        </button>
        <button
          type="button"
          className={`${mode === "existing" ? "active" : ""} ${theme}_image-form-Btn`}
          onClick={() => handleModeChange("existing")}
        >
          🖼️ Existantes
        </button>
      </div>

      {mode === "upload" && (
        <ImageUpload
          maxFiles={1}
          onImageUploaded={(images) => {
            onImageChange(isMainImage ? images[0] || null : [images[0]]);
          }}
          theme={theme}
        />
      )}

      {mode === "existing" && (
        <div className={`existing-images-grid ${theme}_subbtle-background ${theme}_Border`}>
          {imagesServeur.length === 0 ? (
            <p className={`text-muted ${theme}_subbtle-texte`}>Aucune image disponible</p>
          ) : (
            imagesServeur.map((img) => {
              const isSelected = displayImage?.id === img.id;

              return (
                <div
                  key={img.id}
                  className={`image-card ${isSelected ? "selected" : ""} ${theme}_light-background ${theme}_Border`}
                  onClick={() => handleExistingImageToggle(img)}
                >
                  <img src={buildImageUrl(img)} alt={img.nom || "Image"} />
                  <div className="image-card-overlay">
                    {isSelected && <span className="check-icon">✓</span>}
                  </div>
                  <div className={`image-card-info ${theme}_subbtle-background`}>
                    <small className={theme}>{img.nom || `Image ${img.id}`}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {displayImage && (
        <div className="images-preview">
          <p>
            <strong>Image sélectionnée :</strong>
          </p>
          <div className="preview-grid">
            <img
              src={buildImageUrl(displayImage)}
              alt={isMainImage ? "Image principale" : "Image du bloc"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
