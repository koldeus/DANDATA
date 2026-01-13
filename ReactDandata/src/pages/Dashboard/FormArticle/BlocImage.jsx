import React from "react";
import ImageSelector from "./ImageSelector";

export default function BlocImage({ bloc, updateBloc, imagesServeur, theme }) {
  return (
    <ImageSelector
      blocId={bloc.id}
      mode={bloc.imageMode}
      setMode={(newMode) => updateBloc(bloc.id, { imageMode: newMode })}
      currentImage={bloc.images}
      onImageChange={(images) => updateBloc(bloc.id, { images })}
      imagesServeur={imagesServeur}
      theme={theme}
    />
  );
}