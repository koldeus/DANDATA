import React, { useCallback, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "p", "br", "a"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"], 
  });
};

export default function BlocTexte({ bloc, updateBloc, theme }) {
  const isInitializedRef = useRef(false);

  const handleInput = useCallback(() => {
    const editor = document.getElementById(`editor-${bloc.id}`);
    if (!editor) return;

    const sanitized = sanitizeHTML(editor.innerHTML);
    updateBloc(bloc.id, { texte: sanitized });
  }, [bloc.id, updateBloc]);

  useEffect(() => {
    if (!isInitializedRef.current && bloc.texte) {
      const editor = document.getElementById(`editor-${bloc.id}`);
      if (editor) {
        editor.innerHTML = bloc.texte;
        isInitializedRef.current = true;
      }
    }
  }, [bloc.id, bloc.texte]);

  const applyFormat = useCallback(
    (command) => {
      const editor = document.getElementById(`editor-${bloc.id}`);
      if (!editor) return;

      editor.focus();

      if (command === "createLink") {
        const url = prompt("Entrez l'URL du lien:");
        if (url) {
          document.execCommand(command, false, url);

          setTimeout(() => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              let linkElement = range.startContainer;

              while (linkElement && linkElement !== editor) {
                if (linkElement.tagName === "A") {
                  linkElement.className = `${theme}_link`;
                  linkElement.target = "_blank";
                  linkElement.rel = "noopener noreferrer";
                  break;
                }
                linkElement = linkElement.parentElement;
              }

              handleInput();
            }
          }, 10);
        }
      } else {
        document.execCommand(command, false, null);
      }
    },
    [bloc.id, theme, handleInput] 
  );

  return (
    <>
      <div className={`text-toolbar ${theme}_subbtle-background ${theme}_Border`}>
        <button type="button" onClick={() => applyFormat("bold")} title="Gras">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => applyFormat("italic")} title="Italique">
          <em>I</em>
        </button>
        <button type="button" onClick={() => applyFormat("underline")} title="Souligné">
          <u>U</u>
        </button>
        <button type="button" onClick={() => applyFormat("createLink")} title="Lien">
          🔗
        </button>
      </div>
      <div
        id={`editor-${bloc.id}`}
        className={`text-editor ${theme}_subbtle-background ${theme}_Border`}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        role="textbox"
      />
    </>
  );
}