import React, { useState } from "react";
import ImageSelector from "./ImageSelector";

export default function ImagePrincipale({ imagePrincipale, setImagePrincipale, imagesServeur,theme }) {
  const [mode, setMode] = useState("upload");

  return (
    <section className="form-section">
      <h2>🖼️ Image principale</h2>
      <ImageSelector
        blocId="main"
        isMainImage
        mode={mode}
        setMode={setMode}
        imagePrincipale={imagePrincipale}
        setImagePrincipale={setImagePrincipale}
        imagesServeur={imagesServeur}
        theme={theme}
      />
    </section>
  );
}
