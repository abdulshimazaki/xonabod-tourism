import { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const COMMANDS: { cmd: string; label: string; arg?: string }[] = [
  { cmd: "bold", label: "B" },
  { cmd: "italic", label: "I" },
  { cmd: "insertUnorderedList", label: "•list" },
  { cmd: "insertOrderedList", label: "1.list" },
  { cmd: "formatBlock", label: "H2", arg: "H2" },
  { cmd: "formatBlock", label: "H3", arg: "H3" },
  { cmd: "formatBlock", label: "P", arg: "P" },
];

/** Lightweight rich-text editor (bold/italic/lists/headings/links) — no
 * external dependency needed, admin never sees raw HTML. */
export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && ref.current) {
      ref.current.innerHTML = value || "";
      isFirstRender.current = false;
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = prompt("Havola manzilini kiriting (https://...)");
    if (url) exec("createLink", url);
  }

  function insertImage() {
    const url = prompt("Rasm URL manzilini kiriting");
    if (url) exec("insertImage", url);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-stone-200 bg-stone-50 p-2">
        {COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => exec(c.cmd, c.arg)}
            className="rounded-md px-2.5 py-1 font-mono text-xs text-ink-soft hover:bg-pine-50"
          >
            {c.label}
          </button>
        ))}
        <button type="button" onClick={addLink} className="rounded-md px-2.5 py-1 font-mono text-xs text-ink-soft hover:bg-pine-50">
          🔗 havola
        </button>
        <button type="button" onClick={insertImage} className="rounded-md px-2.5 py-1 font-mono text-xs text-ink-soft hover:bg-pine-50">
          🖼 rasm
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        className="prose prose-sm min-h-[160px] max-w-none px-4 py-3 font-body text-ink focus:outline-none empty:before:text-stone-300 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
