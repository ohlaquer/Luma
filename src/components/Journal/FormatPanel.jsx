import { List, ListOrdered, Quote, Palette, Logs } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function FormatPanel({ show, onClose, editor }) {
    const [, setTick] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const force = () => setTick(x => x + 1);
        editor.on("transaction", force);
        editor.on("selectionUpdate", force);
        editor.on("focus", force);
        editor.on("blur", force);
        return () => {
            editor.off("transaction", force);
            editor.off("selectionUpdate", force);
            editor.off("focus", force);
            editor.off("blur", force);
        };
    }, [editor]);

    if (!show) {
        return <div className="overflow-hidden transition-all duration-300 ease-in-out px-5 max-h-0" />;
    }

    const is = (name, attrs) => editor?.isActive(name, attrs);
    const pressed = (active) => active ? "bg-[var(--highlight-border)] shadow-inner scale-[0.97]" : "";

    const setBulletVariant = (variant) => {
        if (!editor) return;
        const chain = editor.chain().focus();
        if (!is("bulletList")) {
            chain.toggleBulletList().run();
        }
        // Після того як ul створено/активно — міняємо атрибут
        editor.chain().focus().updateAttributes("bulletList", { variant }).run();
    };

    return (
        <div className="overflow-hidden transition-all duration-300 ease-in-out px-5 max-h-[300px] pt-3 pb-4">
            <div className="bg-white dark:bg-[var(--block)] border border-[var(--hover)] dark:border-[var(--highlight-border)] rounded-2xl p-3 shadow-lg flex flex-col gap-3 relative max-w-xs mx-auto">
                <div className="flex justify-between items-center text-sm font-semibold text-[var(--text)] px-1">
                    <span>Формат</span>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--hover)] dark:hover:bg-[var(--highlight-border)] text-[var(--muted)]"
                        aria-label="Закрити"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                {/* Стиль тексту */}
                <div className="flex bg-[var(--hover)] dark:bg-[var(--bg)] rounded-lg border border-[var(--hover)] dark:border-[var(--highlight-border)] overflow-hidden divide-x divide-[var(--highlight-border)]">
                    <button onClick={() => editor?.chain().focus().toggleBold().run()} aria-pressed={is("bold")} className={`flex-1 py-2 text-sm font-bold text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("bold"))}`} type="button">B</button>
                    <button onClick={() => editor?.chain().focus().toggleItalic().run()} aria-pressed={is("italic")} className={`flex-1 py-2 text-sm italic text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("italic"))}`} type="button">I</button>
                    <button onClick={() => editor?.chain().focus().toggleUnderline().run()} aria-pressed={is("underline")} className={`flex-1 py-2 text-sm underline text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("underline"))}`} type="button">U</button>
                    <button onClick={() => editor?.chain().focus().toggleStrike().run()} aria-pressed={is("strike")} className={`flex-1 py-2 text-sm line-through text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("strike"))}`} type="button">S</button>
                </div>

                {/* Списки та цитата */}
                <div className="flex gap-2 mt-2 w-full max-w-[320px]">
                    <div className="flex flex-[3] bg-[var(--hover)] dark:bg-[var(--bg)] rounded-lg border border-[var(--hover)] dark:border-[var(--highlight-border)] overflow-hidden divide-x divide-[var(--highlight-border)]">
                        {/* Маркерований (крапочки) */}
                        <button
                            onClick={() => setBulletVariant("disc")}
                            aria-pressed={is("bulletList", { variant: "disc" })}
                            className={`flex-1 py-2 px-3 flex justify-center items-center text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("bulletList", { variant: "disc" }))}`}
                            title="Маркерований список"
                            type="button"
                        >
                            <List className="w-5 h-5" />
                        </button>

                        {/* Тире-список */}
                        <button
                            onClick={() => setBulletVariant("dash")}
                            aria-pressed={is("bulletList", { variant: "dash" })}
                            className={`flex-1 py-2 px-3 flex justify-center items-center text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("bulletList", { variant: "dash" }))}`}
                            title="Список через тире"
                            type="button"
                        >
                            <Logs className="w-5 h-5" />
                        </button>

                        {/* Нумерований */}
                        <button
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            aria-pressed={is("orderedList")}
                            className={`flex-1 py-2 px-3 flex justify-center items-center text-[var(--text)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] transition ${pressed(is("orderedList"))}`}
                            title="Нумерований список"
                            type="button"
                        >
                            <ListOrdered className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        aria-pressed={is("blockquote")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md bg-[var(--hover)] dark:bg-[var(--bg)] hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)] border border-[var(--hover)] dark:border-[var(--highlight-border)] transition ${pressed(is("blockquote"))}`}
                        title="Цитата"
                        type="button"
                    >
                        <Quote className="w-5 h-5 text-[var(--text)]" />
                    </button>

                    <label
                        className="
        w-9 h-9 rounded-md
        bg-[var(--hover)] dark:bg-[var(--bg)]
        hover:bg-[var(--highlight-border)] dark:hover:bg-[var(--primary)]
        border border-[var(--hover)] dark:border-[var(--highlight-border)]
        cursor-pointer flex items-center justify-center
        relative
    "
                    >
                        <input
                            type="color"
                            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Palette className="w-5 h-5 text-[var(--text)] pointer-events-none" />
                    </label>

                </div>
            </div>
        </div>
    );
}
