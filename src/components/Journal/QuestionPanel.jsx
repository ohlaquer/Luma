// QuestionPanel.jsx
import React from "react";
import { RefreshCw } from "lucide-react";

export default function QuestionPanel({ show, questions, loading, onClose, onRegenerate, bgColors, onSelectQuestion }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out px-5 ${
        show ? "max-h-[400px] pt-3 pb-4" : "max-h-0"
      }`}
    >
      <div className="bg-white dark:bg-[var(--hover)] border border-[var(--hover)] rounded-2xl p-4 shadow-lg flex flex-col gap-4 relative max-w-xl mx-auto">
        <div className="flex justify-between items-center text-sm font-semibold text-[var(--text)] px-1">
          <span>Рефлексивні питання</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--hover)] text-[var(--muted)]"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {questions.map((q, i) => {
                const colorClass = bgColors[i % bgColors.length]; // "bg-... dark:bg-... border ..."
                return (
                    <div
                        key={i}
                        className={`${colorClass} relative rounded-xl p-4 shadow-sm cursor-pointer transition hover:scale-[1.02]`}
                        onClick={() => onSelectQuestion && onSelectQuestion(q, colorClass)} // ← передаємо класи
                    >
                        <div className="text-xs font-semibold uppercase mb-2 text-gray-600 dark:text-gray-300">
                            Рефлексія
                        </div>

                        <div className="text-sm font-medium text-gray-800 dark:text-white leading-snug">
                            {q}
                        </div>

                        <button
                            title="Оновити питання"
                            onClick={(e) => {
                                e.stopPropagation(); // щоб клік по кнопці не додавав чіп
                                onRegenerate(i);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-[var(--primary)] dark:text-gray-300 dark:hover:text-[var(--primary)] transition"
                        >
                            <RefreshCw
                                className={`w-5 h-5 ${loading[i] ? "animate-spin" : ""} transition-transform`}
                            />
                        </button>
                    </div>
                );
            })}

        </div>
      </div>
    </div>
  );
}
