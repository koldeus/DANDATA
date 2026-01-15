import React, { useCallback, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "p", "br", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
};

export default function BlocTitre({ bloc, updateBloc, theme }) {
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current && bloc.texte) {
      const editor = document.getElementById(`editor-${bloc.id}`);
      if (editor) {
        editor.innerHTML = bloc.texte;
        isInitializedRef.current = true;
      }
    }
  }, [bloc.id, bloc.texte]);

  const handleInput = useCallback(() => {
    const editor = document.getElementById(`editor-${bloc.id}`);
    if (!editor) return;

    const sanitized = sanitizeHTML(editor.innerHTML);
    updateBloc(bloc.id, { texte: sanitized });
  }, [bloc.id, updateBloc]);

  return (
    <>
      <div className="form-group">
        <label htmlFor={`niveau-${bloc.id}`}>Niveau</label>
        <select
          id={`niveau-${bloc.id}`}
          value={bloc.niveau}
          className={
            ` ${theme}_subbtle-background ` + `${theme}_Border`
          }
          onChange={(e) =>
            updateBloc(bloc.id, {
              niveau: parseInt(e.target.value, 10),
            })
          }
        >
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              H{n}
            </option>
          ))}
        </select>
      </div>
      <div
        id={`editor-${bloc.id}`}
        className={
          "text-editor" + ` ${theme}_subbtle-background ` + `${theme}_Border`
        }
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        role="textbox"
      />
    </>
  );
}