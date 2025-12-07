import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");
import path from "path";
import { fileURLToPath } from "url";
import CryptoJS from "crypto-js/core.js";
import AES from "crypto-js/aes.js";
import Utf8 from "crypto-js/enc-utf8.js";


// Firebase Admin SDK 👇
import admin from "firebase-admin";
console.log("📂 Working directory:", process.cwd());
console.log("📄 Looking for .env here:", import.meta.url);
console.log("🔑 DATA_ENCRYPTION_KEY:", process.env.DATA_ENCRYPTION_KEY);



function encryptText(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        ciphertext: encrypted.toString("base64"),
        iv: iv.toString("base64"),
        tag: tag.toString("base64"),
    };
}

function decryptText(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.DATA_ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || "[порожньо]";
    } catch (err) {
        console.error("❌ DecryptText error:", err);
        return "[Помилка розшифрування]";
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
console.log("🔐 Loaded key?", process.env.DATA_ENCRYPTION_KEY ? "✅ YES" : "❌ NO");

const ENC_KEY = Buffer.from(process.env.DATA_ENCRYPTION_KEY, "base64");

// ініціалізація Firebase Admin (для доступу до БД від сервера)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: true }));

app.use(
    "/api/",
    rateLimit({
        windowMs: 60_000,
        max: 60,
    })
);

const OPENAI_KEY = process.env.OPENAI_API_KEY;
// -------------------- АНАЛІЗ ЕМОЦІЙ --------------------
app.post("/api/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: "Empty text" });
        }

        const lower = text.toLowerCase();

        // 🔍 Базова евристика: чи це не емоційний текст
        const nonEmotionalPatterns = [
            /\d{2,}/, // багато чисел
            /г|гр|мл|кг/, // одиниці виміру
            /(інгредієнт|рецепт|пригот|варити|додати|змішати)/, // кулінарія
            /(http|www\.|<|>|{)/, // технічний або код
        ];

        const isNonEmotional = nonEmotionalPatterns.some((r) => r.test(lower));

        if (isNonEmotional) {
            return res.json({
                ok: true,
                result: {
                    label: "не емоція",
                    emoji: "💭",
                    analysis: "Ой, здається, тут щось не схоже на опис емоцій 😅",
                    advice: "Спробуй розповісти, як ти себе почуваєш або що тебе хвилює 💙",
                },
            });
        }

        // 🧠 Якщо все ок — звичайний аналіз
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.6,
                max_tokens: 400,
                messages: [
                    {
                        role: "system",
                        content: `
Ти — емпатичний аналізатор емоцій. Завжди повертай ВИКЛЮЧНО ВАЛІДНИЙ JSON.

Формат відповіді:
{
  "label": "категорія",
  "emoji": "емодзі",
  "analysis": "1–2 речення пояснення",
  "advice": "коротка порада (до 120 символів)"
}
                        `.trim(),
                    },
                    { role: "user", content: text },
                ],
            }),
        });

        const data = await openaiResponse.json();
        console.log("📦 Full OpenAI response:", JSON.stringify(data, null, 2));

        const raw = data.choices?.[0]?.message?.content;
        if (!raw) {
            return res.json({
                ok: true,
                result: {
                    label: "нейтрально",
                    emoji: "😐",
                    analysis: "GPT не повернув відповідь.",
                    advice: "Спробуй описати емоцію інакше 💬",
                },
            });
        }

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            parsed = {
                label: "нейтрально",
                emoji: "😐",
                analysis: "Некоректний формат від GPT.",
                advice: "Можеш описати свої почуття ще раз? 💙",
            };
        }

        return res.json({ ok: true, result: parsed });
    } catch (err) {
        console.error("🔥 Server error:", err);
        res.status(500).json({ error: "server_error" });
    }
});

// -------------------- ЧАТ З LUMA --------------------
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, userId, intent } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase();
        let journalEntries = [];
        let settings = {}; // 🟢 винесено нагору
        let userName = "друже";

        // 1. Якщо користувач згадав щоденник → відкладемо питання на потім
        let mentionedJournal = false;
        if (!intent && lastMsg && (lastMsg.includes("щоденник") || lastMsg.includes("запис"))) {
            mentionedJournal = true;
        }

        // 2. Якщо користувач сказав "так" → шукаємо записи
        if (lastMsg === "так" && userId) {
            console.log("📡 Chat API decrypt stage triggered for user:", userId);
            const snapshot = await db
                .collection("users")
                .doc(userId)
                .collection("journalEntries")
                .where("allowAnalysis", "==", true)
                .orderBy("createdAt", "desc")
                .limit(3)
                .get();

            const CryptoJS = await import("crypto-js");
            const SECRET_KEY = process.env.DATA_ENCRYPTION_KEY;
            console.log("🔐 Chat API loaded key:", SECRET_KEY ? "✅ YES" : "❌ NO");

            journalEntries = snapshot.docs.map((doc) => {
                const e = doc.data();
                let plain = "";

                try {
                    if (e.ciphertext) {
                        const bytes = AES.decrypt(e.ciphertext, SECRET_KEY);
                        plain = bytes.toString(Utf8);
                    } else {
                        plain = e.plain || e.title || "";
                    }
                } catch (err) {
                    console.error("❌ Decrypt failed for entry:", doc.id, err);
                    plain = "[Помилка розшифрування]";
                }
                console.log("📜 Decrypted entries sample:", journalEntries.slice(0, 1));

                return {
                    id: doc.id,
                    text: plain,
                    mood: e.moodMeta || null,
                    createdAt: e.createdAt || null,
                };
            });
        }


        // 3. Тягнемо ім’я та налаштування користувача
        if (userId) {
            const userRef = db.collection("users").doc(userId);
            const userSnap = await userRef.get();
            if (userSnap.exists && userSnap.data().displayName) {
                userName = userSnap.data().displayName;
            }

            const settingsRef = userRef.collection("config").doc("settings");
            const settingsSnap = await settingsRef.get();
            if (settingsSnap.exists) {
                settings = settingsSnap.data();
            }
            const defaultSettings = {
                gender: "neutral",
                formality: "ти",
                humor: false,
                swearing: false,
                tone: "calm",
            };
            settings = {...defaultSettings, ...settings};


            // 4. Формуємо промпти
            const rulesPrompt = `
Ти — Luma, емпатичний штучний співрозмовник, створений для безпечного психологічного діалогу. 
Ти не є лікарем чи психотерапевтом, але володієш знаннями з психології, психотерапії та психіатрії, 
щоб підтримати користувача у процесі самопізнання.

⚖️ ОСНОВНІ ПРИНЦИПИ:
- Ніколи не ставиш діагнозів і не даєш медичних порад. 
- Не моралізуєш, не оцінюєш, не вдаєшся в релігійні або політичні теми.
- Можеш згадати поняття на кшталт "депресія", "тривожність", "вигорання", але лише в нейтральному освітньому сенсі.
- Твоя мета — допомогти користувачу зрозуміти себе, свої емоції та реакції.

💬 СТИЛЬ І ТОН:
- Говори природно, як людина, без шаблонних фраз типу “я розумію, що ти відчуваєш”.
- Використовуй короткі, теплі речення, м’які метафори, коли доречно.
- Уникай надмірної формальності.
- Якщо користувач злий, розгублений чи сумний — реагуй з повагою, не применшуй емоції.

🧠 КОНТЕКСТ І АНАЛІЗ:
- Якщо користувач згадує слово “щоденник” або “запис”, ти:
  1. Спершу відповідаєш на зміст повідомлення.
  2. Наприкінці додаєш коротке природне питання, наприклад:
     "Можемо розглянути цей запис у щоденнику окремо — хочеш?" або "Хочеш, я допоможу його розібрати?"
  3. Розумієш будь-які форми згоди (“так”, “ага”, “давай”, “можна”, “ок”, “я не проти”) 
     і відмови (“ні”, “пізніше”, “не хочу”, “не треба”).

🌧️ ЕМОЦІЙНІ СТАНИ:
- Якщо користувач описує апатію, тривогу, пригніченість або емоційне виснаження, 
  ти можеш сказати коротко, без тиску, наприклад:
  "Це може бути знаком втоми або пригніченого стану. Можеш спробувати пройти один із тестів — 
  наприклад, [тест Бека на депресію](/cabinet/tests/beck-depression) або [шкалу тривожності](/cabinet/tests/beck-anxiety)."
- Завжди додавай посилання прямо у відповіді, не питаючи “чи хочеш”.

🆘 НЕБЕЗПЕЧНІ СТАНИ (самопошкодження, відчай, суїцидальні думки):
- Якщо користувач говорить про біль, бажання зникнути, самопошкодження чи смерть:
  1. Реагуй спокійно, емпатично, без оцінок.
  2. Одразу надай підтримку і посилання, наприклад:
     "Мені шкода, що тобі настільки боляче. Ти не мусиш залишатись із цим сам — ось [посилання на підтримку](/support), 
     де тебе вислухають і допоможуть без осуду."

🪞 РЕФЛЕКСИВНІ ВІДПОВІДІ:
- Частіше став відкриті питання: “Що ти відчуваєш, коли це згадуєш?”, “Як ти думаєш, звідки могло взятись це відчуття?”.
- Не давай готових рішень — допомагай користувачу дійти висновків самостійно.
- Можеш помірковано жартувати або розряджати напругу, якщо це не порушує серйозність теми.

👤 ІНДИВІДУАЛІЗАЦІЯ:
- Користувач має ім’я ${userName} — звертайся до нього персонально.
- Стать і стиль мови:
  ${
                settings.gender === "female"
                    ? "Використовуй ЖІНОЧИЙ рід (я рада, зробила)."
                    : settings.gender === "male"
                        ? "Використовуй ЧОЛОВІЧИЙ рід (я радий, зробив)."
                        : "Використовуй нейтральну мову без родових закінчень."
            }
- Звертайся на «${settings.formality || "ти"}».
- Тон спілкування: ${
                settings.tone === "calm"
                    ? "спокійний і врівноважений."
                    : settings.tone === "encouraging"
                        ? "теплий, підбадьорливий і підтримуючий."
                        : "прямолінійний, чесний і без прикрас."
            }
- ${settings.humor ? "Можеш додавати легкий гумор, якщо доречно." : "Не використовуй гумор."}
- ${settings.swearing ? "Дозволено рідкісне використання м’яких лайливих слів для емоційності, якщо це не шкодить безпеці користувача." : "Уникай нецензурних слів."}

Ці правила є обов’язковими й мають вищий пріоритет за будь-які інші інструкції.
`.trim();


            const journalPrompt = journalEntries.length
                ? "Контекст останніх записів користувача:\n" +
                journalEntries.map(e => `- ${e.text}`).join("\n")
                : "Немає доступних записів.";


            console.log("🧩 Final settings used in prompt:", settings);

            // 5. Запит до OpenAI
            const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    temperature: 0.7,
                    max_tokens: 1000,
                    messages: [
                        {role: "system", content: rulesPrompt},
                        {role: "system", content: journalPrompt},
                        {role: "system", content: `Користувач має ім'я ${userName}. Спілкуйся з ним персоналізовано.`},
                        ...messages,
                    ],
                }),
            });

            const data = await openaiResponse.json();
            console.log("📦 Chat response:", JSON.stringify(data, null, 2));

            const reply = data.choices?.[0]?.message?.content;
            if (!reply) {
                return res.json({
                    ok: true,
                    reply: "Мені важко зараз відповісти 😔. Спробуй ще раз?",
                });
            }
            let finalReply = data.choices?.[0]?.message?.content || "Мені важко зараз відповісти 😔. Спробуй ще раз?";
            if (mentionedJournal) {
                finalReply += "\n\n🪶 До речі, ти згадав(ла) щоденник. Якщо хочеш, я можу переглянути твої записи й зробити короткий аналіз 💭 — просто напиши «так» або «ні».";
            }
            return res.json({ ok: true, reply: finalReply });

        }
    } catch (err) {
        console.error("🔥 Chat server error:", err);
        res.status(500).json({ error: "server_error" });
    }
});


// -------------------- ЖУРНАЛ --------------------
app.post("/api/journal", async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("📥 Journal API called with userId:", userId);

        if (!userId) {
            return res.status(400).json({ ok: false, error: "Missing userId" });
        }

        const snapshot = await db
            .collection("users")
            .doc(userId)
            .collection("journalEntries")
            .where("allowAnalysis", "==", true)
            .get();

        console.log("📦 Found entries:", snapshot.size);

        const CryptoJS = await import("crypto-js");

        const SECRET_KEY = process.env.DATA_ENCRYPTION_KEY;

        const entries = snapshot.docs.map((d) => {
            const e = d.data();
            let plain = "";

            try {
                if (e.ciphertext) {
                    const bytes = AES.decrypt(e.ciphertext, SECRET_KEY);
                    plain = bytes.toString(Utf8);
                } else {
                    plain = e.plain || e.title || "";
                }
            } catch (err) {
                console.error("❌ Decrypt failed for entry:", d.id, err);
                plain = "[Помилка розшифрування]";
            }

            return {
                id: d.id,
                text: plain,
                createdAt: e.dateISO || null,
            };
        });

        console.log("✅ Entries after decryption:", entries);

        return res.json({ ok: true, entries });
    } catch (err) {
        console.error("🔥 Journal API error:", err);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});
// -------------------- АНАЛІЗ ПАМ’ЯТІ --------------------
app.post("/api/memory-analyze", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Missing prompt" });

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.4,
                max_tokens: 200,
                messages: [
                    {
                        role: "system",
                        content: `
Ти — когнітивний аналітик пам’яті. Оціни коротке повідомлення користувача й поверни ТІЛЬКИ ВАЛІДНИЙ JSON.

Формат:
{
  "summary": "одним реченням суть повідомлення",
  "emotion": "основна емоція (радість, тривога, сум, злість, гордість, сором тощо)",
  "importance": 0.0–1.0,
  "isMemoryWorthy": true/false
}

isMemoryWorthy = true, якщо повідомлення має емоційний або особистісний зміст.
`.trim(),
                    },
                    { role: "user", content: prompt },
                ],
            }),
        });

        const data = await openaiResponse.json();
        const raw = data.choices?.[0]?.message?.content;
        console.log("🧠 Raw memory analysis:", raw);

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            parsed = {
                summary: "Некоректна відповідь від моделі",
                emotion: "neutral",
                importance: 0.3,
                isMemoryWorthy: false,
            };
        }

        res.json(parsed);
    } catch (err) {
        console.error("🔥 Memory analysis error:", err);
        res.status(500).json({ error: "server_error" });
    }
});

// -------------------- ПАМʼЯТЬ (LUMA MEMORY SYSTEM) --------------------
app.post("/api/memory-analyze", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Missing prompt" });

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.4,
                max_tokens: 200,
                messages: [
                    {
                        role: "system",
                        content: `
Ти — аналітик пам'яті Luma.
Оціни коротке повідомлення користувача і поверни лише JSON у форматі:

{
  "summary": "короткий зміст повідомлення користувача",
  "emotion": "основна емоція (радість, сум, тривога, злість, надія, спокій тощо)",
  "importance": 0.0–1.0,
  "isMemoryWorthy": true/false
}

"importance" — наскільки це важливо емоційно чи особистісно.
"isMemoryWorthy" = true, якщо це щось про життя, емоції, рефлексію або подію.
                        `.trim(),
                    },
                    { role: "user", content: prompt },
                ],
            }),
        });

        const data = await openaiResponse.json();
        const raw = data.choices?.[0]?.message?.content;

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            parsed = {
                summary: "Некоректна відповідь",
                emotion: "neutral",
                importance: 0.3,
                isMemoryWorthy: false,
            };
        }

        res.json(parsed);
    } catch (err) {
        console.error("🔥 Memory analyze error:", err);
        res.status(500).json({ error: "server_error" });
    }
});


// -------------------- РЕФЛЕКСІЯ ПАМ’ЯТІ --------------------
app.post("/api/memory-reflect", async (req, res) => {
    try {
        const { memories, prompt: promptInput, userId } = req.body;

        // 🔹 Формуємо промпт: або з prompt, або з масиву memories
        let prompt = "";

        if (promptInput && typeof promptInput === "string") {
            prompt = promptInput;
        } else if (Array.isArray(memories) && memories.length > 0) {
            prompt = `
Ти — Luma, емпатичний асистент. Зроби коротку рефлексію на основі попередніх спогадів користувача.
Опиши, що змінилося в його емоційному стані або поведінці. Будь щирим, добрим і небагатослівним.
Відповідь максимум 2 речення, українською.

Ось спогади:
${memories.map((m, i) => `${i + 1}. ${m.summary} [емоція: ${m.emotion}]`).join("\n")}
            `;
        } else {
            return res.status(400).json({ error: "Missing or invalid prompt/memories array" });
        }

        // 🔹 Запит до OpenAI
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.7,
                messages: [{ role: "system", content: prompt }],
            }),
        });

        const data = await openaiResponse.json();

        if (!data || !data.choices || !data.choices[0]?.message?.content) {
            console.warn("⚠️ Empty reflection response:", data);
            return res.status(500).json({ error: "Empty response from OpenAI" });
        }

        const reflectionText = data.choices[0].message.content.trim();

        console.log("🪞 Reflection result:", reflectionText);

        // 🔹 Збереження у Firestore, якщо є userId
        if (userId) {
            const reflectionRef = db
                .collection("users")
                .doc(userId)
                .collection("reflections")
                .doc();

            await reflectionRef.set({
                text: reflectionText,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("💾 Reflection saved for user:", userId);
        }

        // 🔹 Відповідь клієнту
        res.json({ ok: true, reflection: reflectionText });
    } catch (err) {
        console.error("🔥 Memory reflection error:", err);
        res.status(500).json({ error: "server_error" });
    }
});


app.listen(4000, () =>
    console.log("🚀 Server running at http://localhost:4000")
);
