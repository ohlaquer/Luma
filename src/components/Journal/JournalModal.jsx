// JournalModal.jsx
import React, { useEffect, useRef, useState } from "react";
import reflectionQuestions from "./journalQuestions";
import ImagePreview from "./ImagePreview";
import FormatPanel from "./FormatPanel";
import QuestionPanel from "./QuestionPanel";
import JournalTopBar from "./JournalTopBar";
import BottomToolbar from "./BottomToolbar";
import JournalTextarea from "./JournalTextarea";
import JournalActions from "./JournalActions";
import MoodPanel from "./MoodPanel";
import MoodBadge from "./MoodBadge";
import JournalEditor from "./JournalEditor";
import useReflectionQuestions from "./useReflectionQuestions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import CancelWarningModal from "./CancelWarningModal"; // ← додай цей імпорт


function normalizeInitialImages(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((it) => {
            if (!it) return null;
            if (typeof it === "string") return { url: it };        // "https://..." → {url}
            if (it?.url) return { url: it.url };                   // вже правильний формат
            if (it?.src) return { url: it.src };                   // {src: "..."} → {url}
            if (it instanceof File) return { url: URL.createObjectURL(it) };
            return null;
        })
        .filter(Boolean);
}


function stripChips(html = "") {
    if (!html) return "";
    return html.replace(/<span[^>]*data-chip="1"[^>]*>.*?<\/span>/gis, "");
}

function normText(t) {
    return String(t ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function dedupChips(chips = []) {
    const seen = new Set();
    const out = [];
    for (const ch of Array.isArray(chips) ? chips : []) {
        const text = normText(ch?.label ?? ch?.text ?? ch?.title ?? ch?.value);
        if (!text) continue;
        if (seen.has(text)) continue;   // ❗️дедуп лише за текстом
        seen.add(text);
        out.push(ch);                   // лишаємо першу знайдену версію (з її colorClass)
    }
    return out;
}


export default function JournalModal({
                                         open,                // нове: керує видимістю
                                         onClose,
                                         onSave,

                                         // нові: префіл для режиму "Змінити"
                                         initialTitle = "",
                                         initialHtml = "",
                                         initialPlainText = "",
                                         initialImages = [],
                                         initialMoodMeta = {},
                                         initialQuestionsChips = [],
                                         initialDateISO = null,
                                         initialBookmarked = false,


                                         askConsent = true, // ← НОВЕ: якщо false — не питаємо згоду (редагування)
                                     }) {
    const today = new Date().toLocaleDateString("uk-UA", {
        weekday: "long",
        day: "2-digit",
        month: "short",
    });

    // ↑ десь разом з іншими useState:
    const [showConsent, setShowConsent] = useState(false);

// якщо хочеш керувати з JournalPage: проп askConsent = true/false
// у сигнатурі компонента постав дефолт:
/// function JournalModal({ ..., askConsent = true, ... }) { ... }

    const buildPayload = () => {
        const content = editorRef.current?.getContent?.() ?? { html: "", chips: [], plain: "" };
        const cleanHtml = stripChips(content.html || "");
        const uniqueChips = dedupChips(content.chips || []);

        //перевірка на порожню назву:
        const safeTitle = title.trim() === "" ? "Без назви" : title.trim();

        return {
            title: safeTitle,
            moodMeta,
            images,
            tags: selectedTags,
            reasons: selectedReasons,
            editorHtml: cleanHtml,
            questionsChips: uniqueChips,
            plainText: content.plain || "",
            dateISO: entryDate instanceof Date ? entryDate.toISOString() : new Date().toISOString(),
            bookmarked: isBookmarked,
        };
    };




    const finalizeSave = (allowAnalysis) => {
        const payload = buildPayload();
        payload.allowAnalysis = allowAnalysis; // 👈 додаємо прямо у запис
        payload.consent = { allowAnalysis, at: new Date().toISOString(), version: 1 };
        onSave(payload);
        setShowConsent(false);
        onClose?.();
    };




    // === ЛОКАЛЬНІ СТЕЙТИ ===
    const [title, setTitle] = useState("");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const fileInputRef = useRef(null);
    const menuRef = useRef();
    useEffect(() => {
        if (!open) return;
        setIsBookmarked(Boolean(initialBookmarked));
    }, [open, initialBookmarked]);

    const prefilledRef = useRef(false);


    const [activePanel, setActivePanel] = useState(null); // null | "format" | "question" | "mood"
    const panelRef = useRef(null);
    const [panelHeight, setPanelHeight] = useState(0);
    const [panelOpacity, setPanelOpacity] = useState(0);
    const [moodStep, setMoodStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [showCancelWarning, setShowCancelWarning] = useState(false);

    const allQuestions = reflectionQuestions.flatMap((block) => block.questions);
    const bgColors = [
        "bg-pink-400/30 dark:bg-pink-500/60 border border-pink-500/20",
        "bg-sky-400/30 dark:bg-sky-500/60 border border-sky-500/20",
        "bg-amber-400/30 dark:bg-amber-500/60 border border-amber-500/20",
        "bg-emerald-400/30 dark:bg-emerald-500/60 border border-emerald-500/20"
    ];

    const editorRef = useRef(null);
    const [moodMeta, setMoodMeta] = useState(null);
    const [moodDraft, setMoodDraft] = useState(null);
    const { currentQuestions: questions, loading: loadingQuestions, handleRegenerate } = useReflectionQuestions();

    const [entryDate, setEntryDate] = useState(new Date());   // вибрана дата
    const [showCalendar, setShowCalendar] = useState(false);  // попап календаря
    const calendarRef = useRef(null);

// закривати попап по кліку назовні
    useEffect(() => {
        if (!showCalendar) return;
        const onDocClick = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [showCalendar]);



    // === ПРЕФІЛ: коли модалку відкрили, закинь у стейти дані запису ===
    useEffect(() => {
        if (!open) return;
        if (activePanel === "mood") {
            setMoodDraft(moodMeta ?? null); // якщо був вибраний — підвантажимо як старт
        }
        setTitle(initialTitle || "");
        setImages(normalizeInitialImages(initialImages));
        const hasMood = initialMoodMeta && Object.keys(initialMoodMeta).length > 0;
        setMoodMeta(hasMood ? initialMoodMeta : undefined);

        setSelectedTags(Array.isArray(initialMoodMeta?.tags) ? initialMoodMeta.tags : []);
        setSelectedReasons(Array.isArray(initialMoodMeta?.reasons) ? initialMoodMeta.reasons : []);

        // legacy-синхронізація
        if (typeof setText === "function") setText(initialPlainText || "");
        if (typeof setMood === "function") {
            const em = initialMoodMeta?.moodEmoji || initialMoodMeta?.emoji || "";
            setMood(em);
        }

    }, [
        open,
        initialTitle, initialImages, initialMoodMeta, initialQuestionsChips,
        initialPlainText, ,
    ]);

    useEffect(() => {
        if (!open) return;
        setEntryDate(initialDateISO ? new Date(initialDateISO) : new Date());
    }, [open, initialDateISO]);


    // === Закинути контент у редактор, якщо він має імперативні методи ===
    useEffect(() => {
        if (!open || !editorRef.current) return;

        // якщо редактор вже містить чіпси — не вставляємо їх повторно
        const content = editorRef.current.getContent?.();
        if (content?.chips?.length && initialQuestionsChips?.length) {
            const current = content.chips.map(c => c.text.toLowerCase());
            const incoming = initialQuestionsChips.map(c => c.text.toLowerCase());
            const alreadySame =
                current.length === incoming.length &&
                current.every((c, i) => c === incoming[i]);

            if (alreadySame) return; // нічого не робимо, уникаємо дублювання
        }

        const ed = editorRef.current;
        ed.setContent({
            html: stripChips(initialHtml || ""),
            plain: initialPlainText || "",
            chips: dedupChips(initialQuestionsChips || []).reverse(),
        });
        +// (опційно) продублювати встановлення курсора на початок
            ed.getEditor()?.commands.focus("start");
        ed.getEditor()?.commands.setTextSelection(0);
    }, [open, initialHtml, initialPlainText, initialQuestionsChips]);



    // === Лок (і відновлення) скролу тільки коли відкрита модалка ===
    useEffect(() => {
        if (!open) return;

        const scrollY = window.scrollY;
        const html = document.documentElement;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

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
      body::-webkit-scrollbar { display: none; }
    `;
        document.head.appendChild(style);

        return () => {
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
        };
    }, [open]);

    // === Закриття меню по кліку поза ним ===
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // === Анімація висувних панелей під тулбаром ===
    const TRANSITION_MS = 300;
    useEffect(() => {
        if (!open) return;

        if (activePanel) {
            const id = requestAnimationFrame(() => {
                if (panelRef.current) {
                    setPanelHeight(panelRef.current.scrollHeight);
                    setPanelOpacity(1);
                }
            });

            let ro;
            if (panelRef.current && "ResizeObserver" in window) {
                ro = new ResizeObserver(() => {
                    if (panelRef.current) {
                        setPanelHeight(panelRef.current.scrollHeight);
                    }
                });
                ro.observe(panelRef.current);
            }

            return () => {
                cancelAnimationFrame(id);
                if (ro) ro.disconnect();
            };
        } else {
            if (panelRef.current) {
                setPanelHeight(panelRef.current.scrollHeight); // фіксуємо поточну висоту
            }
            setPanelOpacity(0); // запускаємо fade-out

            const t = setTimeout(() => {
                setPanelHeight(0); // тільки після завершення opacity-згасання
            }, TRANSITION_MS);

            return () => clearTimeout(t);
        }

    }, [
        open,
        activePanel,
        moodStep,
        selectedTags.length,
        selectedReasons.length,
        questions?.length,
    ]);

    // === Робота з картинками ===
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const max = 10;
        if (images.length + files.length > max) {
            setImageError("Максимум 10 зображень. Вистачить фоток 😼");
            return;
        }
        const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
        setImages((prev) => [...prev, ...newImages]);
        setImageError("");
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
        setImageError("");
    };

    // === Кнопка «Готово» активна тільки коли є заголовок ===
    const canSave = true; // завжди дозволено зберегти

    // // ❗️НЕ РЕНДЕРИТИ модалку, якщо вона закрита
    // if (!open) return null;


    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Фон */}
                    <motion.div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />

                    <div className="journal-scale-wrapper relative z-10">
                    {/* Контейнер */}
                    <motion.div
                        className="relative bg-white dark:bg-[#10142c] text-[var(--text)]
  w-full h-auto max-h-[90vh] sm:max-h-none sm:max-w-xl rounded-2xl shadow-xl overflow-y-auto
  border dark:border-[var(--hover)]
  sm:rounded-2xl sm:my-0 my-0 sm:h-auto sm:overflow-visible
  md:my-6
  fixed sm:relative inset-0 sm:inset-auto flex flex-col"

                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* Верхній тулбар */}
                        <JournalTopBar
                            title={title}
                            setTitle={setTitle}
                            isBookmarked={isBookmarked}
                            setIsBookmarked={setIsBookmarked}
                            onDateClick={() => setShowCalendar((p) => !p)}
                            showCalendar={showCalendar}
                            onChangeDate={setEntryDate}
                            entryDate={entryDate}
                            calendarRef={calendarRef}
                        />
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                        {moodMeta && (moodMeta.moodLabel || moodMeta.moodEmoji || moodMeta.gradient) && (
                            <>
                                {/* Сам бейдж */}
                                <MoodBadge
                                    meta={moodMeta}
                                    onRemove={() => {
                                        setMoodMeta(undefined);
                                        setMoodDraft(null);
                                    }}
                                />

                                {/* Затемнюючий шар поверх (не впливає на layout) */}
                                <div className="absolute inset-0 dark:bg-black/20 mix-blend-multiply pointer-events-none rounded-xl" />
                            </>
                        )}


                        {/* Превʼю фото */}
                        <ImagePreview images={images} handleRemoveImage={handleRemoveImage} />

                        {/* Помилка зображення */}
                        {imageError && (
                            <div className="px-5 pt-1 pb-2">
                                <div className="bg-[var(--hover)] text-[var(--primary)] text-sm px-4 py-2 rounded-xl border border-[var(--primary)] shadow-sm text-center transition-all">
                                    Ви можете додати до 10 зображень.<br />
                                    Оберіть ті, що найкраще передають ваш стан 💙
                                </div>
                            </div>
                        )}

                        {/* Текстове поле */}
                        <JournalEditor ref={editorRef} onChange={() => {}} />

                        {/* Панелі */}
                        <div
                            className="transition-[height] duration-300 ease-in-out overflow-hidden"
                            style={{ height: activePanel ? `${panelHeight}px` : "0px" }}
                        >
                            <div
                                ref={panelRef}
                                className="transition-opacity duration-300 ease-in-out px-5 pt-1 pb-4"
                                style={{
                                    opacity: panelOpacity,
                                    pointerEvents: panelOpacity === 0 ? "none" : "auto",
                                }}
                            >
                                {activePanel === "format" && (
                                    <FormatPanel
                                        show={true}
                                        onClose={() => setActivePanel(null)}
                                        editor={editorRef.current?.getEditor()}
                                    />
                                )}

                                {activePanel === "question" && (
                                    <QuestionPanel
                                        show={true}
                                        questions={questions}
                                        loading={loadingQuestions}
                                        onClose={() => setActivePanel(null)}
                                        onRegenerate={handleRegenerate}
                                        bgColors={bgColors}
                                        onSelectQuestion={(q, colorClass) =>
                                            editorRef.current?.insertChip(q, colorClass)
                                        }
                                    />
                                )}

                                {activePanel === "mood" && (
                                    <MoodPanel
                                        step={moodStep}
                                        setStep={setMoodStep}
                                        mood={moodDraft}
                                        setMood={setMoodDraft}
                                        selectedTags={selectedTags}
                                        setSelectedTags={setSelectedTags}
                                        selectedReasons={selectedReasons}
                                        setSelectedReasons={setSelectedReasons}
                                        onSliderNext={() => {}}
                                        onTagsNext={() => {}}
                                        onInfluenceNext={({ gradient, label, emoji, moodEmoji, tags, reasons, colors, index }) => {
                                            const resolvedIndex =
                                                index ??
                                                (typeof moodDraft?.index === "number" ? Math.round(moodDraft.index) : null) ??
                                                (typeof moodDraft?.moodIndex === "number" ? Math.round(moodDraft.moodIndex) : null);

                                            if (resolvedIndex == null) return;

                                            const fb = [
                                                { label: "Дуже погано", emoji: "😖" },
                                                { label: "Погано", emoji: "😔" },
                                                { label: "Скоріше погано", emoji: "😕" },
                                                { label: "Нейтрально", emoji: "😐" },
                                                { label: "Скоріше добре", emoji: "🙂" },
                                                { label: "Добре", emoji: "😄" },
                                                { label: "Дуже добре", emoji: "🤩" },
                                            ][resolvedIndex] || {};

                                            const safeTags = Array.isArray(tags) ? tags : selectedTags;
                                            const safeReasons = Array.isArray(reasons) ? reasons : selectedReasons;

                                            setMoodMeta({
                                                moodIndex: resolvedIndex,
                                                moodLabel: label ?? fb.label,
                                                moodEmoji: moodEmoji ?? emoji ?? fb.emoji,
                                                tags: safeTags,
                                                reasons: safeReasons,
                                                gradient,
                                                colors,
                                            });

                                            setActivePanel(null);
                                            setMoodStep(1);
                                            setSelectedTags([]);
                                            setSelectedReasons([]);
                                            setMoodDraft(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        </div>
                        <div className="sticky bottom-0 left-0 right-0 bg-[var(--block)] dark:bg-[#10142c] z-40">
                        {/* Нижній тулбар */}
                        <BottomToolbar
                            onToggleFormatPanel={() => setActivePanel((p) => (p === "format" ? null : "format"))}
                            onToggleQuestionPanel={() => setActivePanel((p) => (p === "question" ? null : "question"))}
                            onToggleMoodPanel={() => setActivePanel((p) => (p === "mood" ? null : "mood"))}
                            onImageUploadClick={() => fileInputRef.current?.click()}
                            mood={moodMeta?.moodEmoji || ""}
                            setMood={(emoji) => setMoodMeta((prev) => ({ ...(prev || {}), moodEmoji: emoji }))}
                        />
                        </div>

                        {/* Ховаємий інпут */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {/* Кнопки */}
                        <JournalActions
                            onClose={() => {
                                setShowCancelWarning(true);
                            }}
                            onSave={() => {
                                if (askConsent) {
                                    setShowConsent(true);
                                } else {
                                    onSave(buildPayload());
                                    onClose?.();
                                }
                            }}
                            canSave={canSave}
                        />

                        <CancelWarningModal
                            show={showCancelWarning}
                            onStay={() => setShowCancelWarning(false)}
                            onConfirm={() => {
                                setShowCancelWarning(false);
                                onClose?.();
                            }}
                        />

                        {/* Згода */}
                        {showConsent && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div
                                    role="alertdialog"
                                    aria-modal="true"
                                    className="w-[90%] sm:w-full max-w-md rounded-2xl border border-[var(--highlight-border)] bg-[var(--card-bg)] dark:bg-[var(--panel-dark)] p-5 shadow-xl"
                                >

                                <h3 className="text-lg font-semibold text-[var(--text)] mb-3 text-center">
                                        Дозволити Luma обробити цей запис?
                                    </h3>
                                    <p className="text-[var(--muted)] mb-6 text-center">
                                        Якщо <b>погодишся</b> — Luma одноразово проаналізує запис і дасть підказки.
                                        Якщо <b>не погодишся</b> — він залишиться приватним, і Luma його не читатиме.
                                        <span className="block text-xs opacity-70 mt-2">Це не є медичною допомогою.</span>
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                        <button
                                            onClick={() => setShowConsent(false)}
                                            className="text-sm rounded-lg px-4 py-2 bg-[var(--highlight-bg)] text-[var(--text)]
                               hover:bg-[var(--highlight-border)] hover:text-white transition duration-200"
                                        >
                                            Повернутися до редагування
                                        </button>
                                        <button
                                            onClick={() => finalizeSave(false)}
                                            className="text-sm rounded-lg px-4 py-2 bg-[var(--highlight-bg)] text-[var(--text)]
                               hover:bg-[var(--highlight-border)] hover:text-white transition duration-200"
                                        >
                                            Не погоджуюсь
                                        </button>
                                        <button
                                            onClick={() => finalizeSave(true)}
                                            className="text-sm rounded-lg px-4 py-2 bg-[var(--highlight-bg)] text-[var(--text)]
                               hover:bg-[var(--highlight-border)] hover:text-white transition duration-200"
                                        >
                                            Погоджуюсь
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                    </div>
                </motion.div>

            )}
        </AnimatePresence>
    );
}
