import React from "react";

export default function CancelWarningModal({ show, onStay, onConfirm }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                            text-[var(--text)] rounded-2xl shadow-xl border border-[var(--highlight-border)] p-6">

                <h2 className="text-xl font-semibold mb-3 text-center">
                    Закрити без збереження?
                </h2>

                <p className="opacity-80 text-center mb-6">
                    Усе, що ви написали, буде втрачено без можливості відновлення.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">

                    <button
                        onClick={onStay}
                        className="px-4 py-2 rounded-lg bg-[var(--highlight-bg)]
                        hover:bg-[var(--highlight-border)] text-[var(--text)] transition">
                        Повернутися
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                         px-4 py-2.5 rounded-xl
                        bg-[#E56A6A] text-white
                         hover:bg-[#D95C5C]
                        shadow-sm
                         transition-colors duration-200
                            "
                    >
                        Закрити без збереження
                    </button>


                </div>
            </div>
        </div>
    );
}
