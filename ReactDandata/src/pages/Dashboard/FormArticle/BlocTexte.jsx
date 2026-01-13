import React, { useCallback } from "react";
import DOMPurify from "dompurify";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "p", "br", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
};

export default function BlocTexte({ bloc, updateBloc, theme }) {
  const applyFormat = useCallback(
    (command) => {
      const editor = document.getElementById(`editor-${bloc.id}`);
      if (!editor) return;

      editor.focus();

      if (command === "createLink") {
        const url = prompt("Entrez l'URL du lien:");
        if (url) {
          document.execCommand(command, false, url);
        }
      } else {
        document.execCommand(command, false, null);
      }
    },
    [bloc.id]
  );

  const handleInput = useCallback(() => {
    const editor = document.getElementById(`editor-${bloc.id}`);
    if (!editor) return;

    const sanitized = sanitizeHTML(editor.innerHTML);
    updateBloc(bloc.id, { texte: sanitized });
  }, [bloc.id, updateBloc]);

  return (
    <>
      <div
        className={`text-toolbar ${theme}_subbtle-background ${theme}_Border`}
      >
        <button type="button" onClick={() => applyFormat("bold")} title="Gras">
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          title="Italique"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("underline")}
          title="Souligné"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("createLink")}
          title="Lien"
        >
          🔗
        </button>
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
      >
        {!bloc.texte && <span className="editor-placeholder">Texte...</span>}
      </div>
    </>
  );
}
