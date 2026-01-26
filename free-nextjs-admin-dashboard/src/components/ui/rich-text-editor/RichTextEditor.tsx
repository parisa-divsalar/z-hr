"use client";

import { Extension, type CommandProps, type Editor } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type OutputFormat = "text" | "html";
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type RichTextEditorProps = {
  initialContent?: string;
  onChange: (value: string) => void;
  outputFormat?: OutputFormat;
  placeholder?: string;
  minRows?: number;
  className?: string;
};

const decodeHtmlEntities = (value: string) => {
  if (typeof window === "undefined") {
    return value;
  }
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const stripHtmlTags = (value: string) => {
  if (typeof window === "undefined") {
    return value.replace(/<[^>]*>/g, "");
  }
  const doc = new DOMParser().parseFromString(value, "text/html");
  return doc.body.textContent ?? "";
};

const normalizeTextValue = (value: string) => {
  const normalized = value.replace(/\r\n/g, "\n");
  if (!normalized.trim()) {
    return "";
  }
  const decoded = decodeHtmlEntities(normalized);
  if (/<[a-z][\s\S]*>/i.test(decoded)) {
    return stripHtmlTags(decoded).replace(/\r\n/g, "\n");
  }
  return decoded;
};

const convertTextToHtml = (value: string) => {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    return "";
  }
  return normalized
    .split("\n")
    .map((line) => (line.trim() ? `<p>${line}</p>` : "<p><br/></p>"))
    .join("");
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: CommandProps) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: CommandProps) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const headingOptions = [
  { label: "Body", value: "p" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
];

const fontSizeOptions = [
  { label: "Small", value: "12px" },
  { label: "Base", value: "14px" },
  { label: "Large", value: "16px" },
  { label: "XL", value: "18px" },
];

export default function RichTextEditor({
  initialContent = "",
  onChange,
  outputFormat = "text",
  placeholder = "Write your content...",
  minRows = 6,
  className,
}: RichTextEditorProps) {
  const lastEmittedValueRef = useRef<string>("");
  const lastAppliedContentRef = useRef<string>("");
  const [headingValue, setHeadingValue] = useState("p");

  const initialEditorContent = useMemo(
    () => (outputFormat === "text" ? convertTextToHtml(initialContent) : initialContent),
    [initialContent, outputFormat],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      FontSize,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: initialEditorContent,
    editorProps: {
      attributes: {
        class:
          "rich-text-editor-content rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none",
        dir: "auto",
        lang: "fa",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      const value =
        outputFormat === "text"
          ? normalizeTextValue(editor.getText())
          : editor.getHTML();
      if (value !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = value;
        onChange(value);
      }
    },
  });

  const handleLink = useCallback(() => {
    if (!editor) {
      return;
    }
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter link URL", previousUrl);
    if (url === null) {
      return;
    }
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    if (outputFormat === "text") {
      const normalizedIncoming = normalizeTextValue(initialContent);
      if (normalizedIncoming === lastEmittedValueRef.current) {
        return;
      }
    } else if (initialContent === lastEmittedValueRef.current) {
      return;
    }
    if (initialEditorContent === lastAppliedContentRef.current) {
      return;
    }
    editor.commands.setContent(initialEditorContent || "", false);
    lastAppliedContentRef.current = initialEditorContent;
    lastEmittedValueRef.current =
      outputFormat === "text"
        ? normalizeTextValue(editor.getText())
        : editor.getHTML();
  }, [editor, initialEditorContent, outputFormat]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const updateHeadingValue = () => {
      const activeHeading = headingOptions.find((option) => {
        if (option.value === "p") {
          return editor.isActive("paragraph");
        }
        const level = Number(option.value.replace("h", ""));
        return editor.isActive("heading", { level });
      });
      setHeadingValue(activeHeading?.value ?? "p");
    };
    updateHeadingValue();
    editor.on("selectionUpdate", updateHeadingValue);
    editor.on("transaction", updateHeadingValue);
    return () => {
      editor.off("selectionUpdate", updateHeadingValue);
      editor.off("transaction", updateHeadingValue);
    };
  }, [editor]);

  const handleHeadingChange = useCallback(
    (value: string) => {
      if (!editor) {
        return;
      }
      const { state } = editor;
      const { selection, schema } = state;
      const { $from, $to } = selection;
      const applyBlockToSelection = (nodeType: string, attrs?: Record<string, unknown>) => {
        if (selection.empty || !$from.sameParent($to) || !$from.parent.isTextblock) {
          if (nodeType === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().setHeading(attrs as { level: HeadingLevel }).run();
          }
          return;
        }

        const parent = $from.parent;
        const parentType = parent.type;
        const parentAttrs = parent.attrs;
        const before = parent.content.cut(0, $from.parentOffset);
        const selected = parent.content.cut($from.parentOffset, $to.parentOffset);
        const after = parent.content.cut($to.parentOffset);
        const nodes = [];

        if (before.size) {
          nodes.push(parentType.create(parentAttrs, before));
        }
        if (nodeType === "paragraph") {
          nodes.push(schema.nodes.paragraph.create(null, selected));
        } else {
          nodes.push(schema.nodes.heading.create(attrs, selected));
        }
        if (after.size) {
          nodes.push(parentType.create(parentAttrs, after));
        }

        const fragment = Fragment.fromArray(nodes);
        const tr = state.tr.replaceWith($from.before(), $from.after(), fragment).scrollIntoView();
        editor.view.dispatch(tr);
        editor.commands.focus();
      };

      if (value === "p") {
        applyBlockToSelection("paragraph");
        return;
      }
      const rawLevel = Number(value.replace("h", ""));
      const level = Math.min(Math.max(rawLevel, 1), 6) as HeadingLevel;
      applyBlockToSelection("heading", { level });
    },
    [editor],
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      if (!editor) {
        return;
      }
      editor.chain().focus().setFontSize(value).run();
    },
    [editor],
  );

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:shadow-lg ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="rounded-md px-2 py-1 font-semibold text-gray-700 hover:bg-gray-100"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="rounded-md px-2 py-1 font-semibold italic text-gray-700 hover:bg-gray-100"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className="rounded-md px-2 py-1 font-semibold underline text-gray-700 hover:bg-gray-100"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="rounded-md px-2 py-1 text-gray-700 line-through hover:bg-gray-100"
        >
          S
        </button>

        <select
          aria-label="Headings"
          onChange={(event) => handleHeadingChange(event.target.value)}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          value={headingValue}
        >
          {headingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
        >
          # List
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().unsetLink().run()}
          className="rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
        >
          Unlink
        </button>
        <select
          aria-label="Font size"
          onChange={(event) => handleFontSizeChange(event.target.value)}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          defaultValue="14px"
        >
          {fontSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ minHeight: `${Math.max(minRows, 6) * 24}px` }}>
        <EditorContent editor={editor} role="textbox" aria-label={placeholder} />
      </div>
    </div>
  );
}

