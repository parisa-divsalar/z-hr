"use client";

import { useMemo } from "react";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";

const FONT_SIZE_OPTIONS = [
  { label: "Small", value: "14px" },
  { label: "Base", value: "16px" },
  { label: "Large", value: "18px" },
  { label: "XL", value: "20px" },
  { label: "2XL", value: "22px" },
  { label: "3XL", value: "24px" },
];

type ToolbarButtonProps = {
  title: string;
  onClick: () => void;
  active?: boolean;
  label: string;
};

const ToolbarButton = ({ title, label, onClick, active }: ToolbarButtonProps) => {
  const baseStyles =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50";
  const activeStyles = active
    ? "border-brand-500 bg-brand-50 text-brand-600 dark:border-brand-400 dark:bg-white/5 dark:text-brand-300"
    : "border-transparent bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:bg-white/10";

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${baseStyles} ${activeStyles}`}
    >
      {label}
    </button>
  );
};

type EditorToolbarProps = {
  editor: Editor | null;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const fontSizeOptions = useMemo(() => FONT_SIZE_OPTIONS, []);
  if (!editor) {
    return null;
  }
  const fontSize = editor.getAttributes("textStyle").fontSize ?? "16px";
  const headingLevel = editor.isActive("heading")
    ? editor.getAttributes("heading").level ?? 0
    : 0;

  const handleFontSizeChange = (value: string) => {
    if (!value) {
      return;
    }
    editor.chain().focus().setFontSize(value).run();
  };

  const addLink = () => {
    if (typeof window === "undefined") {
      return;
    }
    const previousUrl = editor.getAttributes("link").href;
    const href = window.prompt("Add a link", previousUrl ?? "https://");
    if (!href) {
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href, target: "_blank" }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-[11px] font-semibold tracking-wide text-gray-600 shadow-sm transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
      <div className="flex gap-1">
        <ToolbarButton
          title="Bold"
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          title="Italic"
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          title="Underline"
          label="U"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          title="Strike"
          label="S"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      </div>

      <div className="flex items-center gap-2 border-l border-gray-200 pl-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500 dark:border-white/10 dark:text-gray-400">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Headings
        </label>
        <select
          aria-label="Heading level"
          value={String(headingLevel)}
          onChange={(event) => {
            const rawValue = event.target.value;
            if (rawValue === "0") {
              editor.chain().focus().setParagraph().run();
              return;
            }
            const level = Number(rawValue) as Level;
            editor.chain().focus().setHeading({ level }).run();
          }}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
        >
          <option value="0">Body</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1">
        <ToolbarButton
          title="Bullet list"
          label="• List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          title="Ordered list"
          label="# List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          title="Blockquote"
          label="❝"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-l border-gray-200 pl-2 text-[12px] dark:border-white/10">
        <ToolbarButton
          title={editor.isActive("link") ? "Edit link" : "Add link"}
          label="Link"
          active={editor.isActive("link")}
          onClick={addLink}
        />
        <ToolbarButton title="Remove link" label="Unlink" onClick={removeLink} />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Font</span>
          <select
            aria-label="Font size"
            value={fontSize}
            onChange={(event) => handleFontSizeChange(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            {fontSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;

