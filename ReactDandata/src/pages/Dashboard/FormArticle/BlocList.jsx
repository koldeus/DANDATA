import React from "react";
import BlocItem from "./BlocItem";

export default function BlocList({
  blocs,
  theme,
  updateBloc,
  removeBloc,
  moveBloc,
  metadonnees,
  variableCache,
  imagesServeur,
}) {
  return (
    <>
      {blocs.map((bloc, i) => (
        <BlocItem
          key={bloc.id}
          bloc={bloc}
          index={i}
          theme={theme}
          updateBloc={updateBloc}
          removeBloc={removeBloc}
          moveBloc={moveBloc}
          isFirst={i === 0}
          isLast={i === blocs.length - 1}
          metadonnees={metadonnees}
          variableCache={variableCache}
          imagesServeur={imagesServeur}
        />
      ))}
    </>
  );
}
