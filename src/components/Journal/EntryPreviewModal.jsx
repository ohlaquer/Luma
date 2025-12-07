// src/components/Journal/EntryPreviewModal.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ImageCarouselMulti from "./ImageCarouselMulti";
import { motion, AnimatePresence } from "framer-motion";

// EntryPreviewModal.jsx (додай ці хелпери десь зверху, після імпортів)
const HEX_RX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function hexToRgb(hex) {
    if (!HEX_RX.test(hex || "")) return null;
    let h = hex.replace("#", "");
    if (h.length === 3 || h.length === 4) h = h.split("").map(c => c + c).join("");
    const hasAlpha = h.length === 8;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = hasAlpha ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
}


function normalizeImages(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map((it) =>
        typeof it === "string" ? { url: it } :
            it?.url ? { url: it.url } :
                it?.src ? { url: it.src } :
                    null
    ).filter(Boolean);
}


function stripChips(html = "") {
    return (html || "").replace(/<span[^>]*data-chip="1"[^>]*>.*?<\/span>/gis, "");
}





function getReadableTextColor(bg) {
    const rgb = hexToRgb(bg);
    if (!rgb) return "#111";
    const toLin = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const L = 0.2126 * toLin(rgb.r) + 0.7152 * toLin(rgb.g) + 0.0722 * toLin(rgb.b);
    return L > 0.6 ? "#111" : "#fff";
}

function chipVisual(chip) {
    if (chip && typeof chip === "object" && chip.colorClass) {
        const label = chip.label ?? chip.text ?? chip.title ?? chip.value ?? "Питання";
        return { label, className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium ${chip.colorClass}` };
    }
    if (typeof chip === "string") {
        return {
            label: chip,
            className: "px-2.5 py-1 rounded-full text-[12px] font-medium",
            style: { backgroundColor: "var(--hover)", color: "var(--text)" }
        };
    }
    const label = chip?.label ?? chip?.text ?? chip?.title ?? chip?.value ?? "Питання";
    const gradient = chip?.gradient || chip?.bgGradient || chip?.backgroundImage;
    const bg = chip?.color || chip?.bg || chip?.background || chip?.hex;

    if (gradient && /gradient/i.test(gradient)) {
        return { label, className: "px-2.5 py-1 rounded-full text-[12px] font-medium ring-1 ring-black/5", style: { backgroundImage: gradient, color: chip?.textColor || "#fff" } };
    }
    if (bg) {
        return { label, className: "px-2.5 py-1 rounded-full text-[12px] font-medium ring-1 ring-black/5", style: { backgroundColor: bg, color: chip?.textColor || chip?.fg || getReadableTextColor(bg) } };
    }
    return { label, className: "px-2.5 py-1 rounded-full text-[12px] font-medium", style: { backgroundColor: "var(--hover)", color: "var(--text)" } };
}


// fallback градієнти (світла палітра)
const gradients = {
    sage: {
        light:
            "linear-gradient(180deg, rgba(210,233,221,0.95) 0%, rgba(179,219,199,0.90) 100%)",
    },
};
const NO_MOOD = "sage";

// будуємо фон для mood-картки (без темної теми)
function computeMoodBg(meta = {}) {
    if (meta?.colors?.center && meta?.colors?.edge) {
        return `linear-gradient(180deg, ${meta.colors.center} 0%, ${meta.colors.edge} 100%)`;
    }

    if (meta?.gradient) return meta.gradient;

    // якщо moodMeta порожній або без кольорів — світлий сейдж
    const g = gradients[NO_MOOD];
    return g.light;
}



export default function EntryPreviewModal({ open, entry, onClose }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(open);
    const imgs = normalizeImages(entry?.images || []);

    // Синхронізація при відкритті
    useEffect(() => {
        if (open) setIsVisible(true);
    }, [open]);

    // Функція плавного закриття
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 250); // має співпадати з exit transition.duration
    };


    useEffect(() => {
        if (!open) return;

        const scrollY = window.scrollY;
        const html = document.documentElement;
        const scrollBarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        // блокуємо скрол
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none";

        const style = document.createElement("style");
        style.innerHTML = `
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;
          }
        `;
        document.head.appendChild(style);

        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);

        return () => {
            // відновлюємо все назад
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflow = "";
            document.body.style.width = "";
            document.body.style.paddingRight = "";

            html.style.overflow = "";
            html.style.scrollbarWidth = "";

            document.head.removeChild(style);
            window.scrollTo(0, scrollY);

            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);


    if (!entry) return null;

    // ✅ масиви назв у правильних відмінках
    const daysNom = ["неділя", "понеділок", "вівторок", "середа", "четвер", "пʼятниця", "субота"];
    const monthsGen = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    const dt = new Date(entry.dateISO ?? Date.now());
    const dayIdx = dt.getDay();
    const monthIdx = dt.getMonth();

    const dayNom = daysNom[dayIdx];
    const monthGen = monthsGen[monthIdx];

    const dateStr = `${dayNom}, ${dt.getDate()} ${monthGen}`;
    const timeStr = dt.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return createPortal(
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="entry-preview-modal"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* бекдроп */}
                    <motion.div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />

                    {/* модалка */}
                    <motion.div
                        className="relative bg-white dark:bg-[#10142c] text-[var(--text)]
                           w-full max-w-3xl sm:max-w-4xl rounded-2xl shadow-xl
                           overflow-hidden border dark:border-[var(--hover)]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* header */}
                        <div className="relative px-5 py-4 border-b border-[var(--hover)]">
                            {entry.title && (
                                <h2 className="text-[22px] font-semibold text-[var(--text)] text-center truncate">
                                    {entry.title}
                                </h2>
                            )}
                            <button
                                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-[var(--hover)] transition"
                                aria-label="Закрити перегляд"
                                onClick={handleClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* контент */}
                        <div className="px-5 py-5 max-h-[75vh] overflow-auto space-y-6">
                            {/* 🔹 Шапка з емодзі, тегами, причинами, датою */}
                            <div
                                className="rounded-xl px-4 py-3 shadow-sm mb-4"
                                style={{ backgroundImage: computeMoodBg(entry?.moodMeta) }}
                            >
                                {/* затемнення тільки у dark-темі */}
                                <div className="absolute inset-0 dark:bg-black/25 mix-blend-multiply pointer-events-none rounded-xl" />

                                <div className="text-center mt-6 px-4">
                                    <div className="text-6xl mb-4">
                                        {entry?.moodMeta?.moodEmoji || entry?.moodMeta?.emoji || "🙂"}
                                    </div>

                                    {entry?.moodMeta?.tags?.length > 0 && (
                                        <p className="text-lg font-semibold text-[#34495E] leading-snug">
                                            {entry.moodMeta.tags.join(", ")}
                                        </p>
                                    )}

                                    {entry?.moodMeta?.label && (
                                        <p className="text-base text-[#7b8386] mt-1">
                                            {entry.moodMeta.label}
                                        </p>
                                    )}

                                    {entry?.moodMeta?.reasons?.length > 0 && (
                                        <p className="text-base text-[#34495E] mt-2">
                                            {entry.moodMeta.reasons.join(", ")}
                                        </p>
                                    )}

                                    <p className="text-sm text-[#7b8386] mt-2">
                                        Емоція • {dateStr} о {timeStr}
                                    </p>
                                </div>
                            </div>

                            {imgs.length > 0 && (
                                <section className="mt-5 mb-6">
                                    <div className="rounded-2xl bg-white/70 dark:bg-[rgba(16,20,44,0.6)] backdrop-blur px-3 py-3">
                                        {imgs.length === 1 ? (
                                            // 👇 окремий стиль для одного зображення
                                            <div className="flex justify-center">
                                                <div className="rounded-xl overflow-hidden border border-[var(--hover)] max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
                                                    <img
                                                        src={
                                                            typeof imgs[0] === "string"
                                                                ? imgs[0]
                                                                : imgs[0]?.url || imgs[0]?.downloadURL || imgs[0]?.src || ""
                                                        }
                                                        alt="зображення"
                                                        className="w-full h-auto object-cover rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <ImageCarouselMulti
                                                images={imgs}
                                                onSlideClick={(idx) => setLightboxIndex(idx)}
                                                itemsPerViewDesktop={8}
                                                itemsPerViewTablet={6}
                                                itemsPerViewMobile={7}
                                                frame={false}
                                            />
                                        )}
                                    </div>
                                </section>
                            )}


                            {entry.questionsChips?.length > 0 && (
                                <div className="grid gap-3 sm:grid-cols-2" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                                    {entry.questionsChips.slice(0, 4).map((q, idx) => {
                                        const v = chipVisual(q);
                                        return (
                                            <span
                                                key={idx}
                                                className={v.className || "px-2.5 py-1 rounded-full text-[12px] font-medium text-center"}
                                                style={v.style}
                                                title={typeof q === "string" ? q : q?.tooltip || q?.label || q?.text}
                                            >
                                                {v.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {entry.html ? (
                                <div
                                    className="prose prose-base dark:prose-invert max-w-none text-[var(--text)] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: stripChips(entry.html || "") }}
                                />
                            ) : (
                                <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                                    {entry.plain}
                                </p>
                            )}

                            {lightboxIndex >= 0 && (
                                <Lightbox
                                    open={lightboxIndex >= 0}
                                    close={() => setLightboxIndex(-1)}
                                    slides={imgs.map((img) => ({ src: img.url }))}
                                    index={lightboxIndex}
                                    styles={{ container: { backgroundColor: "rgba(0,0,0,0.7)" } }}
                                />
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
