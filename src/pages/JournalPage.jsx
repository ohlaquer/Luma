// src/pages/JournalPage.jsx
import { useEffect, useMemo, useState } from "react";
import BackLink from "../components/BackLink";
import JournalHeader from "../components/Journal/JournalHeader";
import JournalModal from "../components/Journal/JournalModal";
import JournalEntriesList from "../components/Journal/JournalEntriesList";
import { sortEntries } from "../components/Journal/sortUtils";
import ConfirmDialog from "../components/Journal/ConfirmDialog";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import crypto from "crypto-js";

// 🔥 Firebase імпорти
import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "J0phabUnwZ+2b8/Smywbgqbt9WkDhtShc8nIkePLI+0=";

function encryptText(text) {
    const encrypted = crypto.AES.encrypt(text, SECRET_KEY).toString();
    return encrypted;
}

function decryptText(ciphertext) {
    try {
        const bytes = crypto.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(crypto.enc.Utf8);
    } catch (err) {
        console.error("❌ Decrypt error:", err);
        return "";
    }
}


function useDebouncedValue(value, delay = 250) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

function SearchDropdown({ value, onChange, open, onClose }) {
    const ref = useMemo(() => ({ current: null }), []);
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose?.();
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="relative w-full max-w-[770px] mx-auto">
            <div
                ref={(n) => (ref.current = n)}
                className="
          absolute right-0 mt-2 w-96
          rounded-xl
          border border-[var(--highlight-border)]
          bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
          shadow-lg shadow-black/5
          z-50 p-3
        "
            >
                <div className="flex items-center gap-2">
                    <input
                        autoFocus
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Введи запит…"
                        className="
              w-full rounded-lg px-3 py-2
              bg-[var(--bg)] dark:bg-[var(--panel-dark)]
              ring-1 ring-[var(--hover)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              transition
            "
                    />
                    {value && (
                        <button
                            onClick={() => onChange("")}
                            className="
                p-2 rounded-lg
                hover:bg-[var(--hover)]
                transition
              "
                            title="Очистити"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function JournalPage() {
    const [entries, setEntries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState("");
    const [mood, setMood] = useState("✨");
    const [isMobile, setIsMobile] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [sortBy, setSortBy] = useState("date-new");
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [pendingBookmark, setPendingBookmark] = useState({});

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    const askDelete = (entry) => {
        setEntryToDelete(entry);
        setConfirmOpen(true);
    };

    // ✅ Видалення з Firestore
    const handleConfirmDelete = async () => {
        if (!entryToDelete || !auth.currentUser) {
            setConfirmOpen(false);
            return;
        }

        try {
            const ref = doc(
                db,
                "users",
                auth.currentUser.uid,
                "journalEntries",
                entryToDelete.id
            );
            await deleteDoc(ref);

        } catch (err) {
            console.error("❌ Помилка видалення:", err);
        } finally {
            setEntryToDelete(null);
            setConfirmOpen(false);
        }
    };


    const handleCancelDelete = () => {
        setEntryToDelete(null);
        setConfirmOpen(false);
    };

    // перевірка ширини вікна
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ===== Завантаження з Firestore =====
    useEffect(() => {
        if (!auth.currentUser) return;

        const qSnap = query(
            collection(db, "users", auth.currentUser.uid, "journalEntries"),
            orderBy("dateISO", "desc")
        );

        const unsub = onSnapshot(qSnap, (snapshot) => {
            const loaded = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setEntries(loaded);
        });

        return () => unsub();
    }, []);


// ===== Розшифрування записів перед показом =====
    const decryptedEntries = useMemo(() => {
        return entries.map((e) => {
            const safeDecrypt = (cipher) => {
                if (!cipher) return null;
                try {
                    return decryptText(cipher);
                } catch {
                    return null;
                }
            };

            const safeParse = (str) => {
                try {
                    return JSON.parse(str);
                } catch {
                    return str;
                }
            };

            return {
                ...e,
                title: safeDecrypt(e.title) || e.title || "",
                plain: safeDecrypt(e.ciphertext) || e.plain || "",
                html: safeDecrypt(e.htmlCipher) || e.html || "",
                moodMeta: safeParse(safeDecrypt(e.moodMeta)) || e.moodMeta || {},
                questionsChips: safeParse(safeDecrypt(e.questionsChips)) || e.questionsChips || [],
                images: safeParse(safeDecrypt(e.images)) || e.images || [],
            };
        });
    }, [entries]);

    const toggleBookmark = async (id) => {
        const entry = entries.find((e) => e.id === id);
        if (!entry) return;

        const newValue = !entry.bookmarked;

        // 1) миттєво оновлюємо локально
        setEntries((prev) =>
            prev.map((e) =>
                e.id === id ? { ...e, bookmarked: newValue } : e
            )
        );

        // 2) позначаємо що цей запис зараз оновлюється
        setPendingBookmark((prev) => ({ ...prev, [id]: true }));

        try {
            const entryRef = doc(
                db,
                "users",
                auth.currentUser.uid,
                "journalEntries",
                id
            );

            await updateDoc(entryRef, { bookmarked: newValue });
        } catch (err) {
            console.error("Bookmark update error:", err);

            // ❗ Якщо помилка — повертаємо назад
            setEntries((prev) =>
                prev.map((e) =>
                    e.id === id ? { ...e, bookmarked: !newValue } : e
                )
            );
        } finally {
            setPendingBookmark((prev) => ({ ...prev, [id]: false }));
        }
    };



    // ===== Статистика для хедера =====
    const currentYear = new Date().getFullYear();
    const entryCount = decryptedEntries.filter((e) => {
        const d = new Date(e.dateISO || e.date);
        return d.getFullYear() === currentYear;
    }).length;

    const wordCount = decryptedEntries.reduce((sum, e) => {
        const plain =
            e.plain ||
            e.title ||
            e.html?.replace(/<[^>]+>/g, " ") ||
            "";

        const words = plain.trim().split(/\s+/).filter(Boolean);
        return sum + words.length;
    }, 0);


    const dayCount = new Set(
        entries.map((e) => new Date(e.dateISO || e.date).toDateString())
    ).size;

    // ===== Пошук =====
    const [queryStr, setQuery] = useState("");
    const q = useDebouncedValue(queryStr, 250);

    const norm = (s) => (s || "").toString().toLowerCase().trim();

    const filteredEntries = useMemo(() => {
        const s = norm(q);
        if (!s) return decryptedEntries;

        return decryptedEntries.filter((e) => {
            const hay = [
                e.title,
                e.plain,
                (e.html || "").replace(/<[^>]+>/g, " "),
                ...(e.questionsChips || []).map((x) =>
                    typeof x === "string"
                        ? x
                        : x?.label || x?.text || x?.title || ""
                ),
                ...(e.tags || []).map((x) =>
                    typeof x === "string" ? x : x?.label || x?.text || ""
                ),
                e.moodMeta?.label,
                e.dateISO || e.date || "",
            ]
                .join(" ")
                .toLowerCase();

            return hay.includes(s);
        });
    }, [entries, q]);

    const sortedEntries = useMemo(
        () => sortEntries(filteredEntries, sortBy),
        [filteredEntries, sortBy]
    );

    // ===== Редагування =====
    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    // ✅ Оновлення у Firestore (з шифруванням)
    // ✅ Оновлення у Firestore (з шифруванням і аплоадом)
    const handleUpdateEntry = async (payload) => {
        if (!editingEntry || !auth.currentUser) return;

        const entryRef = doc(
            db,
            "users",
            auth.currentUser.uid,
            "journalEntries",
            editingEntry.id
        );

        // --- ФУНКЦІЯ АПЛОАДУ ОДНОГО ФАЙЛУ ---
        const uploadImage = async (img) => {
            try {
                let fileToUpload = null;

                if (img instanceof File) {
                    fileToUpload = img;
                } else if (img?.file instanceof File) {
                    fileToUpload = img.file;
                } else if (typeof img === "string" && img.startsWith("http")) {
                    return img; // вже готовий URL
                } else if (img?.url?.startsWith("http")) {
                    return img.url; // уже завантажений у Storage
                } else if (img?.url?.startsWith("blob:")) {
                    const res = await fetch(img.url);
                    fileToUpload = await res.blob();
                }

                if (fileToUpload) {
                    const storageRef = ref(
                        storage,
                        `journal/${auth.currentUser.uid}/${Date.now()}_${Math.random()
                            .toString(36)
                            .slice(2)}.png`
                    );
                    await uploadBytes(storageRef, fileToUpload);
                    return await getDownloadURL(storageRef);
                }
            } catch (err) {
                console.error("❌ Помилка завантаження зображення:", err);
            }
            return null;
        };

        // --- ПАРАЛЕЛЬНЕ ЗАВАНТАЖЕННЯ ВСІХ ФОТО ---
        const imageUrls = await Promise.all(
            (payload.images || []).map(uploadImage)
        ).then((arr) => arr.filter(Boolean));



        // --- ОНОВЛЕННЯ ЗАПИСУ ---
        await updateDoc(entryRef, {
            title: encryptText(payload.title || ""),
            htmlCipher: encryptText(payload.editorHtml || ""),
            ciphertext: encryptText(payload.plainText || ""),
            questionsChips: payload.questionsChips || [],
            images: encryptText(JSON.stringify(imageUrls || [])),
            moodMeta: payload.moodMeta ?? editingEntry.moodMeta ?? {},
            dateISO: payload.dateISO || editingEntry.dateISO,
            consent: payload.consent ?? editingEntry.consent,
            bookmarked: payload.bookmarked ?? editingEntry.bookmarked,
            encrypted: true,
            updatedAt: new Date().toISOString(),
        });

        setIsModalOpen(false);
        setEditingEntry(null);
    };



    // ===== Збереження нового запису =====
    const NEUTRAL_EMOJIS = ["✨", "🗒️", "💭", "🌱", "🧩", "🌙", "🧠"];
    const pickRandomNeutralEmoji = () =>
        NEUTRAL_EMOJIS[Math.floor(Math.random() * NEUTRAL_EMOJIS.length)];

    const isMoodSelected = (mm) =>
        Boolean(
            mm &&
            (mm.moodLabel ||
                mm.label ||
                (Array.isArray(mm.tags) && mm.tags.length) ||
                (Array.isArray(mm.reasons) && mm.reasons.length) ||
                (typeof mm.emoji === "string" && mm.emoji.trim()) ||
                (typeof mm.moodEmoji === "string" && mm.moodEmoji.trim()))
        );

    const handleSaveEntry = async (payload) => {
        if (!payload || !auth.currentUser) return;

        const hasMood = isMoodSelected(payload.moodMeta);
        const finalMoodMeta = hasMood
            ? payload.moodMeta
            : { emoji: pickRandomNeutralEmoji(), label: "" };

        // --- ФУНКЦІЯ АПЛОАДУ ОДНОГО ФАЙЛУ ---
        const uploadImage = async (img) => {
            try {
                let fileToUpload = null;

                if (img instanceof File) {
                    fileToUpload = img;
                } else if (img?.file instanceof File) {
                    fileToUpload = img.file;
                } else if (typeof img === "string" && img.startsWith("http")) {
                    return img; // вже готовий URL
                } else if (img?.url?.startsWith("blob:")) {
                    const res = await fetch(img.url);
                    fileToUpload = await res.blob();
                }

                if (fileToUpload) {
                    const storageRef = ref(
                        storage,
                        `journal/${auth.currentUser.uid}/${Date.now()}_${Math.random()
                            .toString(36)
                            .slice(2)}.png`
                    );
                    await uploadBytes(storageRef, fileToUpload);
                    return await getDownloadURL(storageRef);
                }
            } catch (err) {
                console.error("❌ Помилка завантаження зображення:", err);
            }
            return null;
        };

        // --- ПАРАЛЕЛЬНЕ ЗАВАНТАЖЕННЯ ВСІХ ФОТО ---
        const imageUrls = await Promise.all(
            (payload.images || []).map(uploadImage)
        ).then((arr) => arr.filter(Boolean));



        // --- ЗБЕРЕЖЕННЯ ЗАПИСУ ---
        try {
            await addDoc(
                collection(db, "users", auth.currentUser.uid, "journalEntries"),
                {
                    title: encryptText(payload.title || ""), // якщо хочеш — можемо лишити відкритим
                    htmlCipher: encryptText(payload.editorHtml || ""), // 🧩 зашифроване HTML
                    ciphertext: encryptText(payload.plainText || ""),  // 🧩 зашифрований текст
                    encrypted: true,
                    questionsChips: encryptText(JSON.stringify(payload.questionsChips || [])),
                    images: encryptText(JSON.stringify(imageUrls || [])),
                    moodMeta: encryptText(JSON.stringify(finalMoodMeta || {})),
                    dateISO: payload.dateISO || new Date().toISOString(),
                    bookmarked: payload.bookmarked || false,

                    // ⚡️ Додаємо поля
                    userId: auth.currentUser.uid, // 👈 додати ось це!
                    allowAnalysis: payload.consent?.allowAnalysis ?? false,
                    consent: payload.consent ?? { allowAnalysis: false },

                    createdAt: serverTimestamp(),
                }
            );


            setIsModalOpen(false);
        } catch (e) {
            console.error("🔥 Firestore addDoc failed:", e);
            alert("Не вдалось зберегти запис. Перевір правила Firestore (див. інструкцію).");
        }
    };


    return (
        <div className="bg-[var(--bg)] text-[var(--text)]">
            {/* Top back link */}
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-center">
                    <BackLink />
                </div>
            </div>

            {/* HEADER */}
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1180px] mx-auto">
                    <div className="w-full max-w-[780px] mx-auto">
                        <JournalHeader
                            entryCount={entryCount}
                            wordCount={wordCount}
                            dayCount={dayCount}
                            onAddClick={() => setIsModalOpen(true)}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onSearchClick={() => setSearchOpen((o) => !o)}
                        />
                    </div>
                </div>
            </section>

            {/* Випадайка пошуку */}
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <SearchDropdown
                    value={queryStr}
                    onChange={setQuery}
                    open={isSearchOpen}
                    onClose={() => setSearchOpen(false)}
                />
            </section>

            {/* LIST */}
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <div
                    className="max-w-[1180px] mx-auto pt-4 flow-root overflow-hidden"
                    style={{ contain: "layout" }}
                >
                    {sortedEntries.length === 0 ? (
                        <div
                            className="flex items-center justify-center text-center"
                            style={{ minHeight: "calc(100vh - 320px - 60px)" }}
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Тут поки нічого немає
                                </h2>
                                <p className="text-[var(--muted)] max-w-md mx-auto">
                                    Почни з першого запису — поділись тим, що відчуваєш, або
                                    просто напиши про свій день.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <JournalEntriesList
                            entries={sortedEntries}
                            setEntries={setEntries}
                            onEdit={handleEditEntry}
                            onDelete={askDelete}
                            onToggleBookmark={toggleBookmark}
                        />
                    )}
                </div>
            </section>

            {/* Модалки */}
                <JournalModal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingEntry(null);
                    }}
                    onSave={(payload) =>
                        editingEntry ? handleUpdateEntry(payload) : handleSaveEntry(payload)
                    }
                    initialTitle={editingEntry?.title || ""}
                    initialHtml={editingEntry?.html || ""}
                    initialPlainText={editingEntry?.plain || ""}
                    initialImages={editingEntry?.images || []}
                    initialMoodMeta={editingEntry?.moodMeta || {}}
                    initialQuestionsChips={editingEntry?.questionsChips || []}
                    initialDateISO={editingEntry?.dateISO}
                    initialBookmarked={editingEntry?.bookmarked || false}
                    askConsent={!editingEntry}
                />

            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
