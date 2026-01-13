import React from "react";
import ImageSelector from "./ImageSelector";

export default function MainImageSection({
  imagePrincipale,
  setImagePrincipale,
  mainImageMode,
  setMainImageMode,
  imagesServeur,
  theme
}) {
  return (
    <section className={`form-section ${theme}_light-background ${theme}_Border`}>
      <h2>🖼️ Image principale</h2>
      <ImageSelector
        blocId="main"
        isMainImage
        mode={mainImageMode}
        setMode={setMainImageMode}
        currentImage={imagePrincipale}
        onImageChange={setImagePrincipale}
        imagesServeur={imagesServeur}
        theme={theme}
      />
    </section>
  );
}