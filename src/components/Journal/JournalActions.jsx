// JournalActions.jsx
import React from "react";

export default function JournalActions({ onClose, onSave, canSave }) {
    const buttonBaseStyle =
        "text-sm rounded-full px-4 py-2 bg-[var(--highlight-bg)] text-[var(--text)] hover:bg-[var(--highlight-border)] hover:text-white transition duration-200 focus:outline-none focus:ring-0";

    return (
        <div className="flex justify-between items-center px-4 pb-4">
            <button type="button" onClick={onClose} className={buttonBaseStyle}>
                Скасувати
            </button>
            <button
                type="button"                // ← додай це
                onClick={onSave}
                disabled={!canSave}
                className={`${buttonBaseStyle} ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Готово
            </button>
        </div>
    );
}
