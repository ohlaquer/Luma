import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function ConfirmDeleteChat({ open, onConfirm, onCancel }) {
    useEffect(() => {
        if (!open) return;

        const html = document.documentElement;
        const body = document.body;
        const scrollbarComp = window.innerWidth - html.clientWidth;

        const prev = {
            htmlOverflow: html.style.overflow,
            htmlScrollbarWidth: html.style.scrollbarWidth,
            bodyOverflow: body.style.overflow,
            bodyPaddingRight: body.style.paddingRight,
        };

        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-hide-scrollbars", "1");
        styleEl.innerHTML = `
          html::-webkit-scrollbar,
          body::-webkit-scrollbar { display: none; }
        `;
        document.head.appendChild(styleEl);

        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none"; // Firefox
        body.style.overflow = "hidden";
        body.style.paddingRight = `${scrollbarComp}px`;

        return () => {
            if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

            html.style.overflow = prev.htmlOverflow;
            html.style.scrollbarWidth = prev.htmlScrollbarWidth || "";
            body.style.overflow = prev.bodyOverflow;
            body.style.paddingRight = prev.bodyPaddingRight;
        };
    }, [open]);

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <motion.div
                        className="bg-[var(--card-bg)] border border-[var(--highlight-border)]
                                   rounded-xl p-6 shadow-lg w-full max-w-sm"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                            Видалити чат?
                        </h3>
                        <p className="text-[var(--muted)] mb-4">
                            Цю дію неможливо скасувати. Весь діалог з Лумою буде втрачено назавжди.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg border hover:bg-[var(--hover)] transition"
                            >
                                Скасувати
                            </button>
                            <div className="flex-1" />
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg bg-[#E56A6A] text-white hover:bg-[#D95C5C] transition-colors duration-200"

                            >
                                Видалити
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}