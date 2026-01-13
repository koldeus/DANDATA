import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

export default function TextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return (
    <div className="editor">
      <EditorContent editor={editor} />
    </div>
  );
}
    