// src/components/Journal/JournalEntriesList.jsx
import EntryPreviewModal from "./EntryPreviewModal";
import React, { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, Bookmark, Pencil, Printer, Trash2, ChevronLeft, ChevronRight, ChevronDown, Sparkles} from "lucide-react";
import useEntryActions from "./useEntryActions";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- helpers ---------------- */

const pickArray = (...cands) => cands.find(a => Array.isArray(a) && a.length) || [];
const tagLabel = (t) => (typeof t === "string" ? t : (t?.label || t?.text || t?.title || t?.value || ""));

// прибирає <span data-chip="1">...</span> з html, щоб не було дубля з масивом questionsChips
function stripChips(html = "") {
    return (html || "").replace(/<span[^>]*data-chip="1"[^>]*>.*?<\/span>/gis, "");
}



const moodFallbackMap = {
    "Дуже погано": "Дуже неприємний момент",
    "Погано": "Поганий момент",
    "Скоріше погано": "Сумнівний момент",
    "Нейтрально": "Нейтральний момент",
    "Скоріше добре": "Приємний момент",
    "Добре": "Дуже приємний момент",
    "Дуже добре": "Чудовий момент",
};


const getTagsText = (e) => {
    const arr = pickArray(e?.tags, e?.labels, e?.tagList, e?.moodMeta?.tags)
        ?.map(tagLabel)?.filter(Boolean);
    if (!arr || arr.length === 0) return "";
    if (arr.length <= 2) return arr.join(", ");
    return `${arr.slice(0, 2).join(", ")}, тощо`;
};

const getReasonsText = (e) => {
    const arr = pickArray(e?.reasons, e?.why, e?.reasonList, e?.moodMeta?.reasons);
    if (!arr || arr.length === 0) return "";
    if (arr.length <= 2) return arr.join(", ");
    return `${arr.slice(0, 2).join(", ")}, тощо`;
};

function toLinearFromAny(grad) {
    if (!grad) return null;
    const stops = grad.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g);
    if (!stops || stops.length === 0) return null;
    const first = stops[0];
    const last = stops[stops.length - 1];
    return `linear-gradient(180deg, ${first} 0%, ${last} 100%)`;
}

function getVisual(meta = {}) {
    const emoji = meta.moodEmoji || meta.emoji || "✨";
    const label = meta.moodLabel || meta.label || "";

    // Темну тему повністю прибрали — використовуємо тільки світлу палітру
    const gradients = {
        sage: {
            light:
                "linear-gradient(180deg, rgba(210,233,221,0.95) 0%, rgba(179,219,199,0.90) 100%)",
        },
    };
    const NO_MOOD = "sage";

    let headerBg;
    if (meta?.colors?.center && meta?.colors?.edge) {
        headerBg = `linear-gradient(180deg, ${meta.colors.center} 0%, ${meta.colors.edge} 100%)`;
    } else {
        const fromMeta = toLinearFromAny(meta?.gradient);
        headerBg = fromMeta || gradients[NO_MOOD].light;
    }

    return { emoji, label, headerBg };
}


// --- images helpers ---
function normalizeImages(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map((it) => {
        if (!it) return null;
        if (typeof it === "string") return { url: it };   // головний кейс
        if (it?.url) return { url: it.url };             // запасний
        return null;
    }).filter(Boolean);
}




// ---- chips color helpers ----
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

/* --------------- component ---------------- */

const PAGE_SIZES = [6, 8, 12, 24];
// === PageSizeDropdown (СТОЇТЬ ПЕРЕД export default) ===
function PageSizeDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    // Закривати при кліку поза
    useEffect(() => {
        if (!open) return;

        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Кнопка */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5
                   bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                   hover:bg-[var(--hover)] transition"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {value}
                <ChevronDown className="w-4 h-4 opacity-70" />
            </button>

            {/* Випадаючий список */}
            {open && (
                <div
                    className="absolute right-0 mt-1 w-20 rounded-lg border
                     bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                     shadow-lg z-50"
                    role="listbox"
                >
                    {PAGE_SIZES.map((n) => (
                        <button
                            key={n}
                            onClick={() => { onChange(n); setOpen(false); }}
                            className={`block w-full text-left px-3 py-1.5 hover:bg-[var(--hover)] transition
                          ${n === value ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"}`}
                            role="option"
                            aria-selected={n === value}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// === КІНЕЦЬ PageSizeDropdown ===
function ConfirmDialog({ open, onConfirm, onCancel }) {
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
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border hover:bg-[var(--hover)] transition"
                    >
                        Скасувати
                    </button>
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


export default function JournalEntriesList({ entries = [], setEntries, onEdit, onDelete, onToggleBookmark  }) {
    const [openEntry, setOpenEntry] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);  // id відкритого меню
    const [menuNode, setMenuNode] = useState(null);  // DOM-вузол меню (для кліку поза)



    // NEW: стан пагінації
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]); // дефолт 8

    // ПІДКЛЮЧАЄМО ХУК РАНІШЕ, щоб мати hiddenIds та інші дії
    const { editEntry, bookmarkEntry, printEntry, deleteEntry, bookmarked, hiddenIds } =
        useEntryActions({ entries, setEntries, onEdit, onDelete });

    // тільки тепер користуємось hiddenIds
    const visibleEntries = entries.filter(e => !(hiddenIds?.has?.(e.id)));

    // NEW: обчислення сторінок
    const totalPages = Math.max(1, Math.ceil((visibleEntries.length || 0) / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return visibleEntries.slice(start, start + pageSize);
    }, [visibleEntries, page, pageSize]);

    // NEW: ресети сторінки, якщо змінилась кількість записів або pageSize
    useEffect(() => {
        setPage(1);
    }, [pageSize, visibleEntries.length]);

    // закриття меню по кліку поза ним
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuNode && !menuNode.contains(e.target)) setMenuOpen(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen, menuNode]);

    if (!visibleEntries.length) return null;


    return (
        <div className="space-y-3">
            {/* NEW: Toolbar пагінації */}
            <div className="flex items-center gap-3">
  <span className="text-sm opacity-70">
    {visibleEntries.length} записів · стор. {page}/{totalPages}
  </span>

                <div className="ml-auto flex items-center gap-2">
                    <label className="text-sm opacity-70">Показувати кількість записів на одну сторінку:</label>
                    <PageSizeDropdown value={pageSize} onChange={setPageSize} />

                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 rounded-lg border disabled:opacity-50 hover:bg-[var(--hover)] transition"
                        disabled={page <= 1}
                        aria-label="Попередня сторінка"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-lg border disabled:opacity-50 hover:bg-[var(--hover)] transition"
                        disabled={page >= totalPages}
                        aria-label="Наступна сторінка"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>


            {/* Список (показуємо тільки елементи поточної сторінки) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0">
                <AnimatePresence>
                    {pageItems.map((e) => {
                        const { emoji, label, headerBg } = getVisual(e.moodMeta);
                        const effectiveBookmarked =
                            typeof e.bookmarked === "boolean"
                                ? e.bookmarked
                                : Boolean(bookmarked[e.id]);

                        const tagsText = getTagsText(e);
                        const reasonsText = getReasonsText(e);
                        const hasMeta = Boolean(tagsText || reasonsText);
                        const imgs = normalizeImages(e?.images || e?.attachments || []);

                        return (
                            <motion.article
                                key={e.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative rounded-2xl bg-transparent p-2 w-full max-w-[560px] mx-auto"
                                style={{ height: "390px" }}
                            >
                                {/* ⬇️ ВСЕРЕДИНІ ЛИШАЄТЬСЯ ТВОЄ `div` З ШАПКОЮ, КОНТЕНТОМ, ФУТЕРОМ */}
                                <div
                                    className="h-full w-full rounded-xl
                       bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                       overflow-hidden
                       will-change-transform transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                       hover:scale-[1.02] hover:shadow-md
                       border border-[var(--highlight-border)] dark:border-[var(--panel-border-dark)]
                       flex flex-col"
                                    onClick={() => setOpenEntry(e)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(ev) =>
                                        (ev.key === "Enter" || ev.key === " ") && setOpenEntry(e)
                                    }
                                >
                                {/* ШАПКА */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div
                                            className="relative rounded-xl px-3 sm:px-4 py-3 shadow-sm overflow-hidden"
                                            style={{ backgroundImage: headerBg }}
                                        >
                                            <div className="absolute inset-0 dark:bg-black/20 pointer-events-none" />
                                            <div className="relative flex items-center gap-3">
      <span className="text-[40px] sm:text-[44px] leading-none select-none">
        {emoji}
      </span>

                                                <div className="min-w-0">
                                                    <div className="font-semibold text-[#34495E] truncate">
                                                        {hasMeta
                                                            ? label || "Емоція"
                                                            : moodFallbackMap[label] || "Момент"}
                                                    </div>

                                                    {hasMeta && tagsText && (
                                                        <div className="text-[13px] text-[#555] truncate">{tagsText}</div>
                                                    )}
                                                    {hasMeta && reasonsText && (
                                                        <div className="text-[13px] text-[#555] truncate">
                                                            {reasonsText}
                                                        </div>
                                                    )}

                                                    <div className="text-[13px] text-[#7b8386] truncate">
                                                        Емоція •{" "}
                                                        {new Date(e.dateISO ?? Date.now()).toLocaleTimeString("uk-UA", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* КОНТЕНТ */}
                                <div className="flex-1 px-4 pt-2 pb-2 overflow-hidden">
                                    {e.title && (
                                        <h3 className="text-[var(--text)] font-semibold text-[18px] leading-[1.2] mb-2">
                                            {e.title}
                                        </h3>
                                    )}

                                    {e.questionsChips?.length > 0 && (
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            {/* Перший чіпс */}
                                            {(() => {
                                                const firstChip = e.questionsChips[0];
                                                const v = chipVisual(firstChip);
                                                return (
                                                    <span
                                                        className={v.className || "px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center justify-center"}
                                                        style={v.style}
                                                        title={
                                                            typeof firstChip === "string"
                                                                ? firstChip
                                                                : firstChip?.tooltip || firstChip?.label || firstChip?.text
                                                        }
                                                    >
                            {v.label}
                          </span>
                                                );
                                            })()}

                                            {/* +N чіпс */}
                                            {e.questionsChips.length > 1 && (
                                                <span
                                                    className="
                            px-2.5 py-1 rounded-full text-[12px] font-medium
                            bg-[var(--hover)] text-[var(--muted)]
                            flex items-center justify-center leading-none
                          "
                                                >
                          +{e.questionsChips.length - 1}
                        </span>
                                            )}
                                        </div>
                                    )}

                                    {/* міні-галерея зображень */}
                                    {imgs.length > 0 && (
                                        <div className="mt-2 -mx-1">
                                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
                                                {imgs.slice(0, 6).map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--hover)]"
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={`Фото ${idx + 1}`}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}

                                                {imgs.length > 7 ? (
                                                    <div
                                                        className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--hover)]"
                                                        aria-label={`Ще ${imgs.length - 6} фото`}
                                                    >
                                                        <div
                                                            className="absolute inset-0 bg-center bg-cover scale-110"
                                                            style={{ backgroundImage: `url(${imgs[6].url})`, filter: "blur(4px)" }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40" />
                                                        <span className="relative z-10 text-white text-sm font-semibold flex items-center justify-center w-full h-full">
                              +{imgs.length - 6}
                            </span>
                                                    </div>
                                                ) : (
                                                    imgs.length === 7 && (
                                                        <div
                                                            key={6}
                                                            className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--hover)]"
                                                        >
                                                            <img
                                                                src={imgs[6].url}
                                                                alt="Фото 7"
                                                                loading="lazy"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {e.html ? (
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none text-[var(--text)] leading-relaxed line-clamp-5"
                                            dangerouslySetInnerHTML={{ __html: stripChips(e.html || "") }}
                                        />
                                    ) : (
                                        <p className="text-[var(--text)] leading-relaxed line-clamp-5">{e.plain}</p>
                                    )}
                                </div>

                                {/* ФУТЕР */}
                                <div className="border-t border-[var(--hover)] px-4 py-2 flex items-center justify-between text-[13px] text-[var(--muted)] relative">
                                    {/* дата */}
                                    <time>
                                        {(() => {
                                            const raw = e.dateISO;
                                            if (!raw) return "—";
                                            const d = new Date(raw);

                                            const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

                                            const weekday = capitalize(d.toLocaleDateString("uk-UA", { weekday: "long" }));
                                            const day = d.toLocaleDateString("uk-UA", { day: "2-digit" });
                                            const month = d.toLocaleDateString("uk-UA", { month: "long" });
                                            const year = d.getFullYear();

                                            return `${weekday}, ${day} ${month} ${year}`;
                                        })()}
                                        {e?.consent?.allowAnalysis && (
                                            <span className="relative inline-flex items-center group ml-1">
      <Sparkles
          className="w-3.5 h-3.5 translate-y-[1px] text-[#68a2de]" // або text-[#fcb59b]
          aria-label="Luma може обробити цей запис"
      />

                                                {/* tooltip */}
                                                <span
                                                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
             whitespace-nowrap rounded-md px-3 py-1 text-xs
             opacity-0 group-hover:opacity-100 transition
             bg-gray-900/90 text-white dark:bg-white/90 dark:text-black shadow-lg"
                                                >
  Luma може обробити цей запис
</span>
    </span>
                                        )}
                                    </time>



                                    {/* кнопки справа */}
                                    <div className="flex items-center gap-2">
                                        {/* 🔖 показуємо, якщо запис у закладках */}
                                        {/* 🔖 кнопка закладки */}
                                        <button
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                onToggleBookmark(e.id); // <-- ПРАВИЛЬНО
                                            }}
                                            className="p-1 rounded hover:bg-[var(--hover)] transition"
                                            aria-label={effectiveBookmarked ? "Зняти закладку" : "Додати в закладки"}
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 transition-all duration-200 ${
                                                    effectiveBookmarked
                                                        ? "text-amber-500"
                                                        : "text-[var(--muted)]"
                                                }`}
                                                fill={effectiveBookmarked ? "currentColor" : "none"}
                                            />
                                        </button>







                                        {/* три крапки */}
                                        <button
                                            className="p-1 rounded hover:bg-[var(--hover)] transition"
                                            aria-label="Меню запису"
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                setMenuOpen(menuOpen === e.id ? null : e.id);
                                            }}
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {/* меню */}
                                        {menuOpen === e.id && (
                                            <div
                                                ref={(node) => menuOpen === e.id && setMenuNode(node)}
                                                onClick={(ev) => ev.stopPropagation()}
                                                className="absolute bottom-10 right-2 w-52
                          bg-white dark:bg-[var(--panel-dark)]
                          border border-[var(--highlight-border)] dark:border-[var(--panel-border-dark)]
                          rounded-lg shadow-lg z-50 py-1"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setMenuOpen(null);
                                                        // Прокидуємо запис із УЖЕ актуальною закладкою
                                                        editEntry({ ...e, bookmarked: effectiveBookmarked });
                                                    }}
                                                    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-[var(--hover)]"
                                                >
                                                    <Pencil className="w-4 h-4" /> Змінити
                                                </button>


                                                {/*<button*/}
                                                {/*    onClick={() => { setMenuOpen(null); bookmarkEntry(e); }}*/}
                                                {/*    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-[var(--hover)]"*/}
                                                {/*>*/}
                                                {/*    <Bookmark className={`w-4 h-4 ${effectiveBookmarked ? "text-amber-500" : ""}`}*/}
                                                {/*              fill={effectiveBookmarked ? "currentColor" : "none"} />*/}
                                                {/*    {effectiveBookmarked ? "Зняти закладку" : "Закладка"}*/}

                                                {/*</button>*/}

                                                <button
                                                    onClick={() => { setMenuOpen(null); printEntry(e); }}
                                                    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-[var(--hover)]"
                                                >
                                                    <Printer className="w-4 h-4" /> Надрукувати
                                                </button>

                                                <button
                                                    onClick={() => onDelete(e)}  // 👈 тільки викликає колбек
                                                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Видалити
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            </motion.article>
                    );
                })}
                </AnimatePresence>
            </div>

            {/* Превʼю */}
            <EntryPreviewModal
                open={!!openEntry}
                entry={openEntry}
                onClose={() => setOpenEntry(null)}
            />
        </div>
    );
}
