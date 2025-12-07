// JournalEditor.jsx
import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import BulletListWithVariant from "./BulletListWithVariant";
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Blockquote from '@tiptap/extension-blockquote'
import ClearOnFullSelection from "./ClearOnFullSelection";
import QuestionChip from "./QuestionChip";
import { Slice, Fragment } from "prosemirror-model";
import { AllSelection } from "prosemirror-state";
import Placeholder from '@tiptap/extension-placeholder';


function stripChipsFromFragment(fragment, chipType) {
    const children = [];
    fragment.forEach((child) => {
        if (child.type === chipType) return;
        if (child.isLeaf) {
            children.push(child);
        } else {
            children.push(child.copy(stripChipsFromFragment(child.content, chipType)));
        }
    });
    return Fragment.fromArray(children);
}

const JournalEditor = forwardRef(function JournalEditor({ initialContent, onChange, onEditorReady }, ref) {
    const [isEmpty, setIsEmpty] = useState(true);
    const scrollRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false, // вимикаємо дефолтні
                orderedList: false,
                blockquote: false,
                strike: true,
                bold: true,
                italic: true,
                gapcursor: false,
                trailingNode: false,

            }),
            Placeholder.configure({
                placeholder: 'Почніть писати…',
                showOnlyCurrent: true,
                includeChildren: true,
            }),
            BulletListWithVariant.configure({ keepMarks: true }),
            OrderedList.configure({ keepMarks: true }),
            ListItem, // ← обов’язково!
            Underline,
            TextStyle,
            Color.configure({ types: ['textStyle'] }),
            Blockquote,
            TaskList,
            TaskItem.configure({ nested: true }),
            QuestionChip,
            ClearOnFullSelection,
        ],
        content: initialContent || "",
        autofocus: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());

            // якщо тексту нема, а дітей > 1 (купа порожніх <p>) — звести до одного пустого абзацу
            if (editor.getText().trim().length === 0 && editor.state.doc.childCount > 1) {
                editor.commands.setContent("", false);
            }
        },

        editorProps: {
            attributes: {
                class: "ProseMirror leading-relaxed outline-none focus:outline-none ring-0",
            },
            handleKeyDown(view, event) {
                const sel = view.state.selection;

                // 👇 Ctrl+Backspace → видаляємо попереднє слово
                if ((event.ctrlKey || event.metaKey) && event.key === "Backspace") {
                    const { $from } = sel;
                    const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, "\ufffc");

                    // шукаємо останній пробіл перед курсором
                    const lastSpace = textBefore.trim().length
                        ? textBefore.search(/\s\S*$/) // останнє слово
                        : -1;

                    const deleteFrom = lastSpace >= 0 ? $from.start() + lastSpace : $from.start();
                    const tr = view.state.tr.delete(deleteFrom, $from.pos);

                    view.dispatch(tr);
                    event.preventDefault();
                    return true;
                }

                const isClearKey = event.key === "Backspace" || event.key === "Delete";

                // 👇 Тільки якщо реально виділено ВСЕ вручну
                if (isClearKey && sel instanceof AllSelection && !event.ctrlKey && !event.metaKey) {
                    const tr = view.state.tr.delete(0, view.state.doc.content.size);
                    view.dispatch(tr);
                    event.preventDefault();
                    return true;
                }

                return false;
            }

        },
    });

    // 🔗 Віддаємо інстанс редактора “нагору”, коли він готовий
    useEffect(() => {
        if (editor && onEditorReady) onEditorReady(editor);
    }, [editor, onEditorReady]);

    useImperativeHandle(
        ref,
        () => ({
            insertChip(text, colorClass = "") {
                if (!editor) return;

                editor
                    .chain()
                    .focus("start") // 👈 фокус на початок
                    .setTextSelection(0) // 👈 курсор на початок документа
                    .insertContent({
                        type: "questionChip",
                        attrs: { text, colorClass },
                    })
                    .insertContent(" ")
                    .run();
            },


            getContent() {
                if (!editor) return { html: "", chips: [], plain: "" };
                let html = editor.getHTML();
                const plain = editor.getText();

                // парсимо DOM
                const temp = document.createElement("div");
                temp.innerHTML = html;

                // Витягуємо чіпси
                const chips = Array.from(temp.querySelectorAll('[data-chip="1"]')).map(el => ({
                    text: el.getAttribute("data-text") || "",
                    colorClass: el.getAttribute("data-color") || "",
                }));

                // ❌ Видаляємо чіпси з html, щоб не дублювались
                temp.querySelectorAll('[data-chip="1"]').forEach(el => el.remove());

                return { html: temp.innerHTML, chips, plain };
            },

            // 🆕 додай оце
            setContent({ html = "", plain = "", chips = [] }) {
                if (!editor) return;

                // текст
                if (html) {
                    editor.commands.setContent(html);
                } else if (plain) {
                    editor.commands.setContent(plain);
                } else {
                    editor.commands.clearContent();
                }

                // чіпси
                if (chips?.length) {
                    chips.forEach(chip => {
                        editor.chain()
                            .focus("start") // 👈 ставимо фокус на початок
                            .setTextSelection(0)
                            .insertContent({
                                type: "questionChip",
                                attrs: {
                                    text: chip.text || chip.label || "",
                                    colorClass: chip.colorClass || ""
                                },
                            })
                            .insertContent(" ")
                            .run();
                    });
                }

                        // 🔥 Після встановлення контенту — курсор у ПОЧАТОК і скидаємо скрол контейнера
                            editor.chain().focus("start").setTextSelection(0).run();
                        requestAnimationFrame(() => {
                              if (scrollRef.current) scrollRef.current.scrollTop = 0;
                            });

            },


            getEditor() {
                return editor || null;
            },
        }),
        [editor]
    );


    if (!editor) {
        return (
            <div className="w-full">
                <div className="px-5 pt-4 pb-4 min-h-[200px] rounded-xl border border-[var(--hover)] bg-white dark:bg-[var(--bg)] text-[var(--text)] overflow-y-auto" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                className="
        rounded-xl
        bg-white
        dark:bg-[#161a34]/90
        text-[var(--text)]
        dark:text-white
        cursor-text
        border
        border-gray-200
        dark:border-white/10
    "

                onMouseDown={(e) => {
                    // Якщо клік всередині контенту ProseMirror — нічого не робимо (щоб не збивати виділення)
                    const inProse = e.target.closest('.ProseMirror');
                    if (inProse) return;

                    // Інакше — фокус без прокрутки (і без стрибка вниз)
                              editor?.commands.focus(undefined, { scrollIntoView: false });
                }}
                aria-label="Текст запису"
            >
                <div ref={scrollRef} className="relative px-5 pt-4 pb-4 h-[220px] overflow-y-auto">
                    <EditorContent editor={editor} />
                </div>
            </div>

        </div>
    );
});

export default JournalEditor;
