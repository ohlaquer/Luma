import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import BackLink from "../components/BackLink";
import { useTheme } from "../components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ChatInput from "../components/ChatInput";
import ConfirmDeleteChat from "../components/ConfirmDeleteChat";
import { encrypt, decrypt } from "../utils/secure";
import { SquareArrowOutUpRight } from "lucide-react";
import { analyzeMessageForMemory, saveMemory, recallMemory, reflectMemories } from "../utils/memorySystem";


// Firebase
import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    orderBy,
    query,
    deleteDoc,
    doc,
} from "firebase/firestore";

// Sidebar
import ChatSidebar from "../components/ChatSidebar";

// LoaderDots variant-3 (три анімовані точки)
function LoaderDots() {
    return (
        <div className="flex gap-1 items-center">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[var(--muted-text)]"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}

// 👉 хелпер для згоди
function isConsent(text) {
    const yesWords = ["так", "можна", "окей", "добре", "проаналізуй", "давай"];
    return yesWords.some((w) => text.toLowerCase().includes(w));
}

export default function ChatPage() {
    const [theme] = useTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isStarted, setIsStarted] = useState(false);
    const [journalConsentGiven, setJournalConsentGiven] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    // слухаємо повідомлення з Firestore
    useEffect(() => {
        if (!currentChatId || !auth.currentUser) return;

        const q = query(
            collection(
                db,
                "users",
                auth.currentUser.uid,
                "chats",
                currentChatId,
                "messages"
            ),
            orderBy("createdAt", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    role: data.role,
                    text: data.text ? decrypt(data.text) : "",
                    createdAt: data.createdAt,
                };
            });
            setMessages(msgs);
            if (msgs.length > 0) setIsStarted(true);
        });

        return () => unsub();
    }, [currentChatId, auth.currentUser]);

    const handleDelete = async (chatId) => {
        if (!auth.currentUser) return;
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "chats", chatId));

        if (chatId === currentChatId) {
            setCurrentChatId(null);
            setMessages([]);
            setIsStarted(false);
        }
    };

    // автоскрол
    useEffect(() => {
        if (messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            }, 100);
        }
    }, [currentChatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 👉 логіка для аналізу щоденника
    const handleJournalAnalysis = async (uid, chatId, currentMessages) => {
        try {
            // 👉 показуємо лоадер
            setIsTyping(true);

            const res = await fetch(`${import.meta.env.VITE_API_BASE}/journal`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: uid }),
            });

            const json = await res.json();
            console.log("📓 Journal API response:", json);
            if (!res.ok || !json.entries || json.entries.length === 0) {


                await addDoc(
                    collection(db, "users", uid, "chats", chatId, "messages"),
                    {
                        role: "luma",
                        text: (reply),
                        createdAt: serverTimestamp(),
                    }
                );

                setIsTyping(false); // ❌ забираємо крапочки
                return;
            }

            const journalText = json.entries
                .slice(-3)
                .map(
                    (e, i) =>
                        `Запис ${i + 1} (${e.createdAt || ""}):\n${e.text}`
                )
                .join("\n\n---\n\n");

            const messagesForApi = [
                ...currentMessages,
                {
                    role: "system",
                    content:
                        "Нижче йдуть записи щоденника користувача (без фото). Проаналізуй їх, якщо є згода.",
                },
                { role: "user", content: journalText },
            ];

            const chatRes = await fetch(`${import.meta.env.VITE_API_BASE}/chat`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messagesForApi,
                    userId: uid,
                    intent: "journal_analysis",
                }),
            });

            const chatJson = await chatRes.json();
            const reply = chatJson.ok
                ? chatJson.reply
                : "Вибач, не можу зараз відповісти.";

            await addDoc(
                collection(db, "users", uid, "chats", chatId, "messages"),
                {
                    role: "luma",
                    text: (reply),
                    createdAt: serverTimestamp(),
                }
            );

        } catch (err) {
            console.error("🔥 Journal analysis error:", err);
        } finally {
            // 👉 завжди вимикаємо крапочки
            setIsTyping(false);
        }
    };

    // надсилання повідомлення
    const handleSend = async () => {
        if (!input.trim() || !auth.currentUser) return;
        if (isTyping) return;

        const uid = auth.currentUser.uid;
        const userText = input.trim();
        setInput("");

        let chatId = currentChatId;

        // 🟦 1. Створюємо чат одразу, навіть якщо flagged
        if (!chatId) {
            const today = new Date();
            const title = today.toLocaleDateString("uk-UA");

            const chatDoc = await addDoc(
                collection(db, "users", uid, "chats"),
                {
                    name: title,
                    createdAt: serverTimestamp(),
                }
            );

            chatId = chatDoc.id;
            setCurrentChatId(chatId);
            setIsStarted(true);
        }


        // 🟦 3. Тепер робимо перевірку модерації
        try {
            const modRes = await fetch(`${import.meta.env.VITE_API_BASE}/moderate`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: userText }),
            });
            const moderation = await modRes.json();

            if (moderation.flagged) {
                await addDoc(
                    collection(db, "users", uid, "chats", chatId, "messages"),
                    {
                        role: "luma",
                        text: encrypt(
                            "💙 Я бачу, що тобі зараз дуже важко. " +
                            "Ти можеш говорити про це, але спробуй описати свій стан без прямих фраз про самопошкодження. " +
                            "Я поряд, і ми можемо обговорити це безпечно.\n\n" +
                            "Якщо тобі потрібна реальна допомога просто зараз — звернись до [служби підтримки](/support)."
                        ),
                        createdAt: serverTimestamp(),
                    }
                );
                return;
            }

        } catch (err) {
            console.error("⚠️ Помилка при перевірці модерації:", err);
        }


        // якщо ще нема чату — створюємо
        if (!chatId) {
            const today = new Date();
            const title = today.toLocaleDateString("uk-UA");

            const chatDoc = await addDoc(
                collection(db, "users", uid, "chats"),
                {
                    name: title,
                    createdAt: serverTimestamp(),
                }
            );

            chatId = chatDoc.id;
            setCurrentChatId(chatId);
            setIsStarted(true);
        }

        // 🧠 Витягуємо пам'ять користувача (останні 5 важливих спогадів)
        const memories = await recallMemory(uid);


        let memoryContext = "Немає збережених спогадів.";
        if (memories.length > 0) {
            memoryContext = memories
                .map(
                    (m, i) =>
                        `(${i + 1}) ${m.summary || "Без опису"} [емоція: ${
                            m.emotion || "—"
                        }]`
                )
                .join("\n");
        }

        const memoryPrompt = `
            Ти — Luma, емпатичний ШІ, який веде безпечну розмову.
            Ось що ти пам'ятаєш про користувача з попередніх розмов:
            ${memoryContext}

            Використовуй цю інформацію лише для кращої емпатії і зв'язності розмови.
            Не цитуй її дослівно, просто враховуй контекст.
            `.trim();



        // 🛑 перевірка на згоду
        const lastLumaMsg = messages[messages.length - 1];
        if (
            isConsent(userText) &&                    // 👈 використовуємо userText
            lastLumaMsg?.role === "luma" &&
            lastLumaMsg?.text.includes("переглянути")
        ) {
            await addDoc(
                collection(db, "users", uid, "chats", chatId, "messages"),
                {
                    role: "user",
                    text: encrypt(userText),
                    createdAt: serverTimestamp(),
                }
            );

            const currentMessagesForApi = messages.map((m) => ({
                role: m.role === "luma" ? "assistant" : m.role,
                content: m.text,
            }));

            handleJournalAnalysis(uid, chatId, currentMessagesForApi);
            return; // інпут вже очищений вище
        }

        // стандартний хендл
        await addDoc(
            collection(db, "users", uid, "chats", chatId, "messages"),
            {
                role: "user",
                text: encrypt(userText),
                createdAt: serverTimestamp(),
            }
        );

        // 🧠 аналіз на пам'ять
        try {
            const analysis = await analyzeMessageForMemory(userText);
            if (analysis.importance > 0.6 && analysis.isMemoryWorthy) {
                await saveMemory(uid, analysis);
                console.log("💾 Memory saved:", analysis.summary);
            } else {
                console.log("🧹 Skipped (not memory-worthy)");
            }
        } catch (err) {
            console.error("⚠️ Memory system error:", err);
        }

        const currentMessages = [
            ...messages.map((m) => ({
                role: m.role === "luma" ? "assistant" : m.role,
                content: m.text,
            })),
            { role: "user", content: userText },
        ];

        try {
            setIsTyping(true); // 👈 показуємо крапочки

            const res = await fetch(`${import.meta.env.VITE_API_BASE}/chat`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: memoryPrompt }, // 🧠 контекст з пам'яті
                        ...currentMessages,
                    ],
                    userId: uid,
                    intent: journalConsentGiven ? "journal_analysis" : null,
                }),
            });

            const data = await res.json();
            setIsTyping(false); // 👈 вимикаємо крапочки

            const reply =
                data.ok && data.reply
                    ? data.reply
                    : "Упс, я не змогла відповісти 😔. Спробуй ще раз.";

            await addDoc(
                collection(db, "users", uid, "chats", chatId, "messages"),
                {
                    role: "luma",
                    text: encrypt(reply),
                    createdAt: serverTimestamp(),
                }
            );
            // ✅ ось СЮДИ вставляємо
            reflectMemories(uid);


        } catch (err) {
            console.error(err);
            setIsTyping(false);
            await addDoc(
                collection(db, "users", uid, "chats", chatId, "messages"),
                {
                    role: "luma",
                    text: encrypt("Помилка зʼєднання з сервером 🚨"),
                    createdAt: serverTimestamp(),
                }
            );
        }
    };



    // автоскрол при рендері
    useEffect(() => {
        if (messagesContainerRef.current && messages.length > 0) {
            const timeout = setTimeout(() => {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
            }, 200);
            return () => clearTimeout(timeout);
        }
    }, [currentChatId, messages.length]);

    return (
        <div className="w-full px-6 py-10 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
            <div className="max-w-[1180px] mx-auto mb-4 flex justify-center">
                <BackLink />
            </div>

            <div className="flex justify-center">
                <div className="flex w-full max-w-[1180px] h-[600px] rounded-3xl shadow-md bg-[var(--card-bg)] text-[var(--text)] transition-colors duration-300">
                    {/* Sidebar */}
                    <div className="hidden md:block border-r border-[var(--highlight-border)] dark:border-[var(--highlight-border)]">
                        <ChatSidebar
                            currentChatId={currentChatId}
                            onSelectChat={setCurrentChatId}
                            onDeleteChat={(id) => {
                                setChatToDelete(id);
                                setConfirmOpen(true);
                            }}
                            onNewChat={() => {
                                setCurrentChatId(null);
                                setMessages([]);
                                setIsStarted(false);
                            }}
                        />

                    </div>

                    {/* Мобільна виїзна панель */}
                    <div
                        className={`absolute left-0 h-[600px] w-64 overflow-hidden bg-[var(--card-bg)] shadow-xl rounded-r-2xl z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                        style={{
                            top: isIOS ? "155px" : "195px",
                        }}
                    >
                        <ChatSidebar
                            mobile
                            onSelectChat={(id) => {
                                setCurrentChatId(id);
                                setSidebarOpen(false);
                            }}
                            currentChatId={currentChatId}
                            onDeleteChat={(id) => {
                                setChatToDelete(id);
                                setConfirmOpen(true);
                            }}
                        />

                    </div>



                    {/* Кнопка-вушко */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-40 bg-[var(--card-bg)]/90 text-[var(--text)] px-2 py-2 rounded-r-xl shadow-md hover:bg-[var(--accent-bg)] transition-all md:hidden"
                    >
                        {sidebarOpen ? "←" : "→"}
                    </button>



                    {/* 👇 тут глобально рендеримо модалку */}
                    <ConfirmDeleteChat
                        open={confirmOpen}
                        onCancel={() => {
                            setConfirmOpen(false);
                            setChatToDelete(null);
                        }}
                        onConfirm={async () => {
                            if (chatToDelete) {
                                await handleDelete(chatToDelete);
                            }
                            setConfirmOpen(false);
                            setChatToDelete(null);
                        }}
                    />



                    {/* Chat content */}
                    <div className="flex flex-col flex-1 px-6 py-5 justify-between">
                        <AnimatePresence mode="wait">
                            {!isStarted ? (
                                <motion.div
                                    key="welcome"
                                    className="flex flex-col items-center justify-center flex-1 text-center"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-2xl font-semibold mb-6">
                                        Твій безпечний простір.
                                    </h2>
                                    <div className="mt-4 flex items-center rounded-full px-4 py-2 gap-2 bg-[var(--neutral-bg)] w-full max-w-lg">
                                        <input
                                            type="text"
                                            placeholder={
                                                isTyping ? "Зачекай, Лума пише..." : "Напишіть щось..."
                                            }
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) =>
                                                !isTyping && e.key === "Enter" && handleSend()
                                            }
                                            disabled={isTyping} // 👈 блокуємо під час відповіді
                                            className={`flex-1 bg-transparent outline-none text-[var(--text)] ${
                                                isTyping ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={isTyping} // 👈 блокуємо кнопку
                                            className={isTyping ? "opacity-50 cursor-not-allowed" : ""}
                                        >
                                            <Send
                                                size={20}
                                                className="text-[var(--muted-text)]"
                                            />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="chat"
                                    className="flex flex-col flex-1 min-h-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Повідомлення */}
                                    <div
                                        ref={messagesContainerRef}
                                        className="flex flex-col gap-2 overflow-y-auto px-1 pr-2 flex-1 min-h-0"
                                    >
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`max-w-[70%] break-words px-4 py-2 rounded-xl ${
                                                    msg.role === "user"
                                                        ? "self-end bg-[var(--neutral-bg)]"
                                                        : "self-start bg-[var(--highlight-bg)]"
                                                } text-[var(--text)] transition-colors duration-300`}
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({node, ...props}) => (
                                                            <a
                                                                {...props}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-blue-400 underline font-medium hover:text-blue-300 hover:underline-offset-2 transition"
                                                            >
                                                                {props.children}
                                                                <SquareArrowOutUpRight size={14} className="ml-1 opacity-80" />
                                                            </a>
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>

                                            </div>
                                        ))}

                                        {/* 👇 якщо Лума ще друкує */}
                                        {isTyping && (
                                            <div className="self-start px-4 py-2">
                                                <LoaderDots />
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>


                                    {/* Інпут */}
                                    <ChatInput
                                        input={input}
                                        setInput={setInput}
                                        handleSend={handleSend}
                                        isTyping={isTyping}
                                    />

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
