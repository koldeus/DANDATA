import React, { useState } from "react";
import ImageSelector from "./ImageSelector";

export default function ImageBloc({ bloc, updateBloc, imagesServeur,theme }) {
  const [mode, setMode] = useState(bloc.imageMode || "upload");

  return (
    <ImageSelector
      blocId={bloc.id}
      mode={mode}
      setMode={(m) => {
        setMode(m);
        updateBloc({ imageMode: m });
      }}
      imagesServeur={imagesServeur}
      theme={theme}
    />
  );
}
