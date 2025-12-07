// ImagePreview.jsx
import React, { useRef } from "react";

export default function ImagePreview({ images, handleRemoveImage }) {
    if (!images || images.length === 0) return null;

    const containerRef = useRef(null);

    const scrollBy = (dir) => {
        if (!containerRef.current) return;
        const step = 80 * 3; // ~3 превʼю за раз
        containerRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <div className="px-4 pt-2">
            <div className="relative">
                {/* стрілки поверх фоток */}
                <button
                    type="button"
                    aria-label="Назад"
                    onClick={() => scrollBy(-1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full
                     bg-white/80 dark:bg-black/40 backdrop-blur border border-[var(--hover)]
                     w-6 h-6 flex items-center justify-center text-sm hover:scale-105"
                >
                    ‹
                </button>
                <button
                    type="button"
                    aria-label="Вперед"
                    onClick={() => scrollBy(1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full
                     bg-white/80 dark:bg-black/40 backdrop-blur border border-[var(--hover)]
                     w-6 h-6 flex items-center justify-center text-sm hover:scale-105"
                >
                    ›
                </button>

                {/* стрічка БЕЗ падінгів — фото під стрілками */}
                <div
                    ref={containerRef}
                    className="flex gap-3 overflow-hidden" // ⬅ було px-7 — прибрали
                >
                    {images.map((img, index) => {
                        const src = typeof img === "string" ? img : img?.url ?? img?.src ?? "";
                        return (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[var(--hover)] shadow"
                            >
                                <img
                                    src={src}
                                    alt={`Зображення ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-sm hover:bg-black transition"
                                    title="Видалити"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
