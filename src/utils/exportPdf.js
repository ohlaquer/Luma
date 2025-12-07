import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts"; // лишаємо Roboto
import { decrypt } from "../utils/secure"; //

// Firebase
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"; // 👈 перевір шлях

// ---- helpers ----
async function urlToBase64(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function smartDecrypt(value) {
    if (!value) return "";
    if (typeof value === "string" && value.startsWith("U2FsdGVkX1")) {
        try {
            const dec = decrypt(value);
            return dec || "";
        } catch (err) {
            console.error("❌ smartDecrypt failed:", err);
            return "";
        }
    }
    return value;
}

function safeParseJSON(value) {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

const safeDec = (val) => {
    try {
        if (!val) return "—";
        const plain = decrypt(val);
        if (!plain) return "—";
        return plain;
    } catch (e) {
        console.warn("❌ safeDec decrypt error:", e);
        return "—";
    }
};

async function maybeImage(url, width = 100) {
    if (!url) return null;
    try {
        console.log("🖼️ Спроба завантажити:", url);
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        console.log("✅ Картинку конвертовано");
        return { image: base64, width, margin: [0, 5, 0, 10] };
    } catch (err) {
        console.warn("❌ Не вдалося завантажити картинку:", url, err);
        return { text: `(❌ ${err.message})` };
    }
}

function stripHtml(s) {
    if (!s) return "";
    return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function asArray(x) {
    if (!x) return [];
    if (Array.isArray(x))
        return x.map((v) => (typeof v === "string" ? v : v?.text ?? String(v)));
    if (typeof x === "object")
        return Object.values(x).map((v) =>
            typeof v === "string" ? v : v?.text ?? String(v)
        );
    return [];
}

function parseMarkdown(text) {
    if (!text) return [{ text: "" }];

    const tokens = [];
    let regex = /(\*\*.*?\*\*|_.*?_|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ text: text.slice(lastIndex, match.index) });
        }

        const token = match[0];
        if (token.startsWith("**")) {
            tokens.push({ text: token.slice(2, -2), bold: true });
        } else if (token.startsWith("_")) {
            tokens.push({ text: token.slice(1, -1), italics: true });
        } else if (token.startsWith("`")) {
            tokens.push({ text: token.slice(1, -1), font: "Courier" });
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        tokens.push({ text: text.slice(lastIndex) });
    }

    return tokens;
}


// 👇 форматування дати
function formatDate(v) {
    if (!v) return "—";
    if (v?.toDate) {
        return v.toDate().toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    return new Date(v).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// 👇 нормальні підписи відправника
function senderLabel(m, profile) {
    // беремо різні можливі поля
    const s = (m?.sender || m?.role || m?.from || "").toLowerCase();

    if (s.includes("user")) return profile?.name || "Користувач";
    if (s.includes("ai") || s.includes("assistant") || s.includes("luma")) return "Luma";
    if (s.includes("system")) return "Програма";

    // fallback: якщо нічого нема
    return profile?.name || "Користувач";
}



// ---- витягуємо чати з повідомленнями ----
async function loadChatsWithMessages(uid) {
    const chats = [];
    const chatsSnap = await getDocs(collection(db, "users", uid, "chats"));

    for (const chatDoc of chatsSnap.docs) {
        const chatData = { id: chatDoc.id, ...chatDoc.data() };

        const messagesSnap = await getDocs(
            collection(db, "users", uid, "chats", chatDoc.id, "messages")
        );
        chatData.messages = messagesSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));

        chats.push(chatData);
    }

    return chats;
}

// ---- main ----
export async function exportUserData({ profile, profileData = {}, journal = [] }) {
    const content = [];

    // --- логотип ---
    const logo = await maybeImage("/luma-logo-light.png", 120);
    if (logo) content.push({ ...logo, alignment: "center", margin: [0, 0, 0, 20] });

    // --- профіль ---
    const avatar = await maybeImage(profile.photoURL, 80);

    content.push({ text: "Архів даних Luma", style: "header" });
    content.push({ text: "Профіль", style: "subheader" });

    if (avatar) {
        content.push({
            columns: [
                avatar,
                [
                    `Ім’я: ${profile.name || "—"}`,
                    `Email: ${profile.email || "—"}`,
                    `Bio: ${profile.bio || "—"}`,
                ],
            ],
            columnGap: 20,
            margin: [0, 0, 0, 20],
        });
    } else {
        content.push(
            `Ім’я: ${profile.name || "—"}`,
            `Email: ${profile.email || "—"}`,
            `Bio: ${profile.bio || "—"}`
        );
    }

    // --- 👇 блок з онбордингу ---
    content.push({ text: "Інформація з онбордингу", style: "subheader" });
    content.push(
        `Вік: ${profileData.age || "—"}`,
        `Стать: ${profileData.gender || "—"}`,
        `Сфера діяльності: ${safeDec(profileData.occupation)}`,
        `Досвід терапії: ${
            profileData.therapyExperience === "yes" ? "так" : "ні"
        }`,
        `Дата створення акаунта: ${formatDate(profileData.createdAt)}`
    );


    content.push({
        text: `Дата експорту: ${new Date().toLocaleString("uk-UA")}`,
        style: "small",
    });
    console.log("🧾 Journal entries:", journal);

    // === 💭 ПАМ’ЯТЬ LUMA ===
    if (auth.currentUser?.uid) {
        const uid = auth.currentUser.uid;

        // 1️⃣ Тягнемо пам’ять
        const memorySnap = await getDocs(collection(db, "users", uid, "memory"));
        const reflectionSnap = await getDocs(collection(db, "users", uid, "reflections"));

        const reflections = reflectionSnap.docs.map((d) => ({
            text: d.data().text || "",
            created: d.data().createdAt?.toDate?.() || new Date(0),
        }));

        if (!memorySnap.empty) {
            content.push({
                text: "Пам’ять Luma",
                style: "subheader",
                pageBreak: "before",
            });

            const memories = memorySnap.docs.map((doc) => {
                const d = doc.data();
                let decoded = {};

                try {
                    // Розшифровуємо JSON
                    const plain = decrypt(d.data);
                    decoded = JSON.parse(plain);
                } catch (err) {
                    console.warn("Не вдалося розшифрувати пам'ять:", err);
                    decoded = { summary: "[Помилка розшифрування]" };
                }

                return {
                    created: d.createdAt?.toDate?.() || new Date(0),
                    importance: d.importance || "—",
                    summary: decoded.summary || decoded.text || "—",
                    emotion: decoded.emotion || "—",
                };
            });

            // 2️⃣ Поєднуємо з рефлексіями за часом (найближчі timestamps)
            for (const m of memories) {
                const closest = reflections.find((r) =>
                    Math.abs(m.created - r.created) < 30000 // 30 секунд різниці
                );
                content.push({
                    text: [
                        { text: "Дата: ", bold: true },
                        { text: `${formatDate(m.created)}\n`, italics: true },
                        { text: "Емоція: ", bold: true },
                        { text: `${m.emotion}\n` },
                        { text: "Важливість: ", bold: true },
                        { text: `${m.importance}\n` },
                        { text: "Короткий зміст: ", bold: true },
                        { text: `${m.summary}\n` },
                        ...(closest
                            ? [
                                { text: "Рефлексія Luma: ", bold: true },
                                { text: `${closest.text}\n` },
                            ]
                            : []),
                    ],
                    margin: [10, 5, 0, 10],
                    style: "aiMessage",
                });
            }
        }
    }

// --- записи щоденника ---
    for (let i = 0; i < journal.length; i++) {
        const e = journal[i];
        const moodLabel = e?.moodMeta?.moodLabel || e?.moodLabel || "—";

        console.log("🧩 Entry", i + 1);
        console.log("questionsChips (raw):", e.questionsChips);

        // 🧠 1. Розшифровка питань
        // --- Розшифровка або fallback питань ---
        let questions = [];

        try {
            const q = e?.questionsChips;

            if (Array.isArray(q)) {
                // Якщо це вже масив
                questions = q
                    .map(x =>
                        typeof x === "string"
                            ? x.trim()
                            : x?.text?.trim() || ""
                    )
                    .filter(Boolean);
            } else if (typeof q === "string" && q.startsWith("U2FsdGVkX1")) {
                // Якщо зашифровано — пробуємо розшифрувати
                const dec = decrypt(q);
                const arr = JSON.parse(dec);
                if (Array.isArray(arr)) {
                    questions = arr
                        .map(x =>
                            typeof x === "string"
                                ? x.trim()
                                : x?.text?.trim() || ""
                        )
                        .filter(Boolean);
                }
            }
        } catch (err) {
            console.warn("⚠️ Не вдалося обробити questionsChips:", err);
        }

// 🩹 Якщо після цього масив порожній — пробуємо дістати текст чіпсів із HTML
        if ((!questions || questions.length === 0) && e?.html) {
            const chipMatches = [...e.html.matchAll(/data-text="([^"]+)"/g)].map(m => m[1]);
            if (chipMatches.length > 0) {
                questions = chipMatches;
                console.log("🧷 Витягнуті питання з HTML:", chipMatches);
            }
        }


        // 🧩 3. Причини, теги, текст
        const reasons =
            asArray(e?.reasons).length > 0
                ? asArray(e?.reasons)
                : asArray(e?.moodMeta?.reasons);

        const tags =
            asArray(e?.tags).length > 0
                ? asArray(e?.tags)
                : asArray(e?.moodMeta?.tags);

        const text =
            smartDecrypt(e?.plain) ||
            smartDecrypt(e?.ciphertext) ||
            stripHtml(smartDecrypt(e?.html)) ||
            stripHtml(smartDecrypt(e?.htmlCipher)) ||
            "(порожньо)";

        console.log("🧠 FINAL questions array:", questions);

        // 🧾 4. Формування контенту для pdfMake
        content.push(
            { text: `Запис №${i + 1}`, style: "subheader", pageBreak: "before" },
            { text: `Заголовок: ${e?.title || "—"}`, style: "entryField" },
            {
                text: `Дата: ${
                    e?.journalDate || e?.dateISO || e?.createdAt
                        ? new Date(
                            e?.journalDate || e?.dateISO || e?.createdAt
                        ).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "—"
                }`,
                style: "entryField",
            },
            { text: `Настрій: ${moodLabel}`, style: "entryField" },
            { text: `Текст: ${text}`, margin: [0, 0, 0, 12] },

            { text: "Що вплинуло на ваш стан?:", style: "entryField" },
            reasons.length
                ? { ul: reasons, margin: [15, 0, 0, 10] }
                : { text: "—", margin: [15, 0, 0, 10] },

            { text: "Як найкраще описати це почуття?:", style: "entryField" },
            tags.length
                ? { ul: tags, margin: [15, 0, 0, 10] }
                : { text: "—", margin: [15, 0, 0, 10] },

            ...(questions.length
                ? [
                    { text: "Рефлексивні питання:", style: "entryField" },
                    { ul: questions, margin: [15, 0, 0, 10] },
                ]
                : []),

        );

        // 🖼️ 5. Зображення (якщо є)
        if (Array.isArray(e?.images) && e.images.length) {
            for (const url of e.images) {
                const img = await maybeImage(url, 250);
                if (img) content.push(img);
            }
        }
    }

    // --- чати ---
    const uid = auth.currentUser?.uid;
    const chats = uid ? await loadChatsWithMessages(uid) : [];

    for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];
        content.push({
            text: `Чат №${i + 1}`,
            style: "subheader",
            pageBreak: "before",
        });

        if (chat?.messages?.length) {
            const sortedMessages = [...chat.messages].sort((a, b) => {
                const t1 = a?.createdAt?.toDate
                    ? a.createdAt.toDate()
                    : new Date(a.createdAt || a.time);
                const t2 = b?.createdAt?.toDate
                    ? b.createdAt.toDate()
                    : new Date(b.createdAt || b.time);
                return t1 - t2;
            });

            sortedMessages.forEach((m) => {
                const when = formatDate(m?.createdAt || m?.time);

                // 🧠 ось головна зміна — розшифровка
                let decryptedText = "";
                try {
                    decryptedText = decrypt(m?.text || "");
                } catch (err) {
                    decryptedText = "[Помилка розшифрування]";
                }

                content.push({
                    text: [
                        { text: `${senderLabel(m, profile)} (${when}):\n`, bold: true },
                        ...parseMarkdown(decryptedText || ""),
                    ],
                    margin: [0, 5, 0, 5],
                    style:
                        m?.sender === "ai" || m?.sender === "assistant" || m?.role === "luma"
                            ? "aiMessage"
                            : "userMessage",
                });
            });
        } else {
            content.push({ text: "(порожній чат)" });
        }
    }

    const docDefinition = {
        content,
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: "center",
                margin: [0, 0, 0, 30],
            },
            subheader: { fontSize: 16, bold: true, margin: [0, 15, 0, 12] },
            small: { fontSize: 9, italics: true, alignment: "right" },
            entryField: { fontSize: 12, bold: true, margin: [0, 6, 0, 6] },
            userMessage: { fontSize: 11, margin: [0, 5, 0, 5] },
            aiMessage: {
                fontSize: 11,
                italics: true,
                color: "#34495E",
                margin: [0, 5, 0, 5],
            },
        },
    };

    pdfMake.createPdf(docDefinition).download("luma-data.pdf");
}
