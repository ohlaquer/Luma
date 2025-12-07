import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { X } from "lucide-react";
import React from "react";
import { Plugin, TextSelection } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform";

const ALLOW_META = "allowChipRemoval";

function QuestionChipView({ node, editor, getPos }) {
    const text = node.attrs.text || "";
    const colorClass = node.attrs.colorClass || "";

    const remove = (e) => {
        e.preventDefault();
        const pos = getPos();

        if (typeof pos === "number") {
            // Зберігаємо позицію, де був чіпс
            const selectionPos = pos;

            editor
                .chain()
                .command(({ tr }) => {
                    tr.setMeta(ALLOW_META, true);
                    tr.deleteRange(pos, pos + node.nodeSize);

                    // Після видалення ставимо курсор на те саме місце
                    tr.setSelection(
                        TextSelection.create(tr.doc, selectionPos)
                    );

                    return true;
                })
                .run();
        }
    };


    return (
        <NodeViewWrapper
            as="div"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm select-none ${colorClass} w-full mb-2`}
            style={{ userSelect: "none" }}
            contentEditable={false}
            draggable={false}
            data-chip="1"
            data-text={text}
            onMouseDown={(e) => e.preventDefault()}
        >

      <span className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 select-none">
        Рефлексія
      </span>

            <span className="text-sm font-medium leading-snug flex-1 ml-2 select-none">
        {text}
      </span>

            <button
                type="button"
                aria-label="Видалити питання"
                onMouseDown={(e) => {
                    e.preventDefault();
                    remove(e);
                }}
                className="ml-2 p-0.5 rounded text-gray-500 hover:text-[var(--primary)] dark:text-gray-300 dark:hover:text-[var(--primary)]"
            >
                <X className="w-4 h-4" />
            </button>
        </NodeViewWrapper>
    );
}

const QuestionChip = Node.create({
    name: "questionChip",
    group: "inline",
    inline: true,
    atom: true,
    selectable: false,
    draggable: false,
    isolating: true,
    defining: true,

    addAttributes() {
        return {
            text: { default: "" },
            colorClass: { default: "" },
        };
    },

    parseHTML() { return [{ tag: 'span[data-chip="1"]' }]; },

    renderHTML({ HTMLAttributes, node }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-chip": "1",
                "data-text": node?.attrs?.text || "",
                "data-color": node?.attrs?.colorClass || "", // 👈 додаємо
                "contenteditable": "false",
                style: "user-select:none;-webkit-user-select:none;display:inline-flex;align-items:center;vertical-align:baseline;",
            }),
        ];
    },




    addNodeView() {
        return ReactNodeViewRenderer(QuestionChipView);
    },

    addKeyboardShortcuts() {
        const isChip = (n) => n && n.type && n.type.name === this.name;

        const deleteTextOnlyInSelection = () => {
            const { state, view } = this.editor;
            const { doc, tr, selection } = state;
            const { from, to, empty } = selection;

            if (empty) return false; // нехай інші правила спрацюють

            // зберігаємо лише текст — чіпи ігноруємо
            const ranges = [];
            doc.nodesBetween(from, to, (node, pos) => {
                if (node.isText && node.text && node.text.length > 0) {
                    const a = Math.max(pos, from);
                    const b = Math.min(pos + node.nodeSize, to);
                    if (b > a) ranges.push([a, b]);
                }
                return undefined;
            });

            if (ranges.length === 0) {
                // у виділенні немає тексту (лише чіпи/порожнечі) — нічого не видаляємо
                return true; // свідомо нічого
            }

            for (let i = ranges.length - 1; i >= 0; i--) {
                const [a, b] = ranges[i];
                tr.delete(a, b);
            }
            view.dispatch(tr);
            return true; // ми все зробили самі


        };

        return {
            // BACKSPACE
            Backspace: () => {
                const { state } = this.editor;
                const { empty, $from, from, to } = state.selection;

                if (!empty) {
                    // виділено щось — видаляємо лише текст
                    return deleteTextOnlyInSelection();
                }

                // порожній карет: блокуємо, якщо зліва чіп
                if (isChip($from.nodeBefore)) return true;

                return false; // інакше — стандартний backspace
            },

            // DELETE
            Delete: () => {
                const { state } = this.editor;
                const { empty, $from } = state.selection;

                if (!empty) {
                    // виділено щось — видаляємо лише текст
                    return deleteTextOnlyInSelection();
                }

                // порожній карет: блокуємо, якщо справа чіп
                if (isChip($from.nodeAfter)) return true;

                return false; // інакше — стандартний delete
            },
        };
    },


    addProseMirrorPlugins() {
        const isChipType = (type) => type && type.name === this.name;

        // 1) Фільтр транзакцій: блокує будь-яке видалення чіпів, крім нашого через "Х"
        const blocksDeletionPlugin = new Plugin({
            filterTransaction: (tr, state) => {
                if (tr.getMeta(ALLOW_META)) return true; // дозволяємо тільки помічене нами

                for (const step of tr.steps) {
                    if (step instanceof ReplaceStep || step instanceof ReplaceAroundStep) {
                        const from = step.from, to = step.to;
                        if (typeof from === "number" && typeof to === "number" && to > from) {
                            let touchesChip = false;
                            state.doc.nodesBetween(from, to, (node) => {
                                if (isChipType(node.type)) {
                                    touchesChip = true;
                                    return false;
                                }
                                return undefined;
                            });
                            if (touchesChip) return false; // 🚫 блокуємо
                        }
                    }
                }
                return true;
            },
        });

        // 2) Кастомні шорткати на Ctrl+A/C/V/X
        const extraKeymap = keymap({
            // Ctrl+A — виділяємо тільки текст, якщо він взагалі є
            "Mod-a": () => {
                const { state, view } = this.editor;
                const { doc } = state;

                let from = null;
                let to = null;

                doc.descendants((node, pos) => {
                    if (node.isText && node.text && node.text.length > 0) {
                        if (from === null) from = pos;
                        to = pos + node.nodeSize;
                    }
                    return undefined;
                });

                if (from === null || to === null) {
                    // тексту немає — нічого не виділяємо (і не даємо браузеру виділити чіпи)
                    return true; // перехопили і свідомо нічого не зробили
                }

                view.dispatch(state.tr.setSelection(TextSelection.create(doc, from, to)));
                return true;
            },

            // Ctrl+C — копіюємо тільки ТЕКСТ із поточного виділення
            "Mod-c": () => {
                const { state } = this.editor;
                const { from, to } = state.selection;

                const text = state.doc.textBetween(from, to, "\n", "\n");
                if (!text) {
                    // немає тексту — нічого не копіюємо (і чіпи теж не копіюємо)
                    return true;
                }

                // Пишемо в буфер (з fallback)
                const write = async (t) => {
                    try {
                        if (navigator.clipboard?.writeText) {
                            await navigator.clipboard.writeText(t);
                        } else {
                            const ta = document.createElement("textarea");
                            ta.value = t;
                            ta.style.position = "fixed";
                            ta.style.opacity = "0";
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand("copy");
                            document.body.removeChild(ta);
                        }
                    } catch (_) {}
                };
                write(text);
                return true; // стопимо дефолт, щоб DOM не чіпав чіпи
            },

            // Ctrl+X — вирізаємо тільки ТЕКСТ (чіпи залишаються)
            "Mod-x": () => {
                const { state, view } = this.editor;
                const { doc, tr, selection } = state;
                const { from, to } = selection;

                // 1) текст у буфер
                const text = doc.textBetween(from, to, "\n", "\n");
                if (!text) {
                    // тексту немає — нічого не вирізаємо (чіпи не чіпаємо)
                    return true;
                }

                const write = async (t) => {
                    try {
                        if (navigator.clipboard?.writeText) {
                            await navigator.clipboard.writeText(t);
                        } else {
                            const ta = document.createElement("textarea");
                            ta.value = t;
                            ta.style.position = "fixed";
                            ta.style.opacity = "0";
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand("copy");
                            document.body.removeChild(ta);
                        }
                    } catch (_) {}
                };
                write(text);

                // 2) видаляємо лише текстові ноди в межах selection
                const ranges = [];
                doc.nodesBetween(from, to, (node, pos) => {
                    if (node.isText && node.text && node.text.length > 0) {
                        const a = Math.max(pos, from);
                        const b = Math.min(pos + node.nodeSize, to);
                        if (b > a) ranges.push([a, b]);
                    }
                    return undefined;
                });

                for (let i = ranges.length - 1; i >= 0; i--) {
                    const [a, b] = ranges[i];
                    tr.delete(a, b);
                }
                if (ranges.length > 0) view.dispatch(tr);

                return true;
            },

            // Ctrl+V — нічого тут не міняємо: у JournalEditor.jsx уже стоїть transformPasted,
            // який вирізає чіпи зі вставки (вставиться лише текст).
        });


        return [blocksDeletionPlugin, extraKeymap];
    },
});

export default QuestionChip;
export { QuestionChipView };
