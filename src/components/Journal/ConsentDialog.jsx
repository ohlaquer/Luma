import React from "react";

export default function ConsentDialog({ open, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0e1228] border border-[var(--hover)] shadow-xl
                   transition-all duration-200 opacity-100 scale-100 p-6"
            >
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
                    Чи дозволяєш Luma обробити цей запис?
                </h2>

                <div className="space-y-3 text-[var(--muted)] text-sm leading-6">
                    <p>
                        Якщо <b>погодишся</b> — запис буде переданий Luma для аналізу і підказок.
                        Якщо <b>не погодишся</b> — він залишиться приватним і Luma не зможе його прочитати.
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                        Це не медична допомога, а лише емоційна підтримка.
                    </p>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl border border-[var(--hover)] text-[var(--text)] hover:bg-[var(--hover)] transition"
                    >
                        Не погоджуюсь
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition shadow"
                    >
                        Погоджуюсь
                    </button>
                </div>
            </div>
        </div>
    );
}
