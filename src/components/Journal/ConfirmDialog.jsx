import { useEffect } from "react";

export default function ConfirmDialog({ open, onConfirm, onCancel }) {
    // Блокування скролу коли відкрите підтвердження
    useEffect(() => {
        if (!open) return;

        const html = document.documentElement;
        const body = document.body;

        const scrollbarComp = window.innerWidth - html.clientWidth;
        const scrollY = window.scrollY;

        // зберігаємо попередні стилі
        const prev = {
            htmlOverflow: html.style.overflow,
            htmlScrollbarWidth: html.style.scrollbarWidth,      // ← нове
            bodyOverflow: body.style.overflow,
            bodyPaddingRight: body.style.paddingRight,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyWidth: body.style.width,
        };

        // інжект стилю для WebKit-скролів
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-hide-scrollbars", "1");
        styleEl.innerHTML = `
    html::-webkit-scrollbar,
    body::-webkit-scrollbar { display: none; }
  `;
        document.head.appendChild(styleEl);

        // лочимо скрол + ховаємо трек
        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none";                   // ← Firefox
        body.style.overflow = "hidden";
        body.style.paddingRight = `${scrollbarComp}px`;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";

        return () => {
            // прибираємо інжектований стиль
            if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

            // повертаємо як було
            html.style.overflow = prev.htmlOverflow;
            html.style.scrollbarWidth = prev.htmlScrollbarWidth || "";
            body.style.overflow = prev.bodyOverflow;
            body.style.paddingRight = prev.bodyPaddingRight;
            body.style.position = prev.bodyPosition;
            body.style.top = prev.bodyTop;
            body.style.width = prev.bodyWidth;

            // відновлюємо позицію прокрутки
            window.scrollTo(0, scrollY);
        };
    }, [open]);



    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                      border border-[var(--highlight-border)]
                      rounded-xl p-6 shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    Видалити запис?
                </h3>
                <p className="text-[var(--muted)] mb-4">
                    Цю дію неможливо скасувати. Запис буде втрачено назавжди.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border hover:bg-[var(--hover)] transition"
                    >
                        Скасувати
                    </button>
                    <div className="flex-1" /> {/* пустий "розпір" */}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:opacity-90 transition"
                    >
                        Видалити
                    </button>
                </div>

            </div>
        </div>
    );
}
