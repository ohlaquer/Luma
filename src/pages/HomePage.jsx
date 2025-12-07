import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function HomePage() {
    const [showAnalyzer, setShowAnalyzer] = useState(false);
    const [text, setText] = useState("");
    const [mood, setMood] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeMood = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setMood(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                console.error("Analyze error", json);
                alert("Помилка аналізу");
            } else {
                setMood(json.result); // { label, emoji, advice }
            }
        } catch (err) {
            console.error(err);
            alert("Помилка мережі");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                {!showAnalyzer ? (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1
                            className="text-4xl md:text-6xl font-bold mb-12 leading-snug whitespace-pre-line"
                            style={{ color: "var(--text)" }}
                        >
                            <TypeAnimation
                                sequence={[
                                    "Справжня сила в тому,\nщоб просто бути собою.",
                                    3000,
                                    "",
                                    1000,
                                    "У щирості немає слабкості.",
                                    3000,
                                    "",
                                    1000,
                                    "Твої почуття мають значення.",
                                    3000,
                                    "",
                                    1000,
                                    "Не потрібно бути ідеальним,\nщоб бути цінним.",
                                    3000,
                                    "",
                                    1000,
                                    "Тебе достатньо.",
                                    3000,
                                    "",
                                    1000,
                                ]}
                                wrapper="p"
                                cursor={true}
                                repeat={Infinity}
                                speed={10}
                                deletionSpeed={30}
                            />
                        </h1>

                        <button
                            onClick={() => setShowAnalyzer(true)}
                            className="font-semibold px-14 py-6 rounded-full text-2xl transition"
                            style={{
                                backgroundColor: "var(--button-bg)",
                                color: "var(--button-text)",
                            }}
                        >
                            Почати розмову
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* 🔙 Плаваючий беклінк */}
                        <AnimatePresence>
                            {showAnalyzer && (
                                <motion.div
                                    key="backlink"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-md mx-auto mb-4 flex justify-center"
                                >
                                    <button
                                        onClick={() => setShowAnalyzer(false)}
                                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-full
                               bg-[var(--button-bg)] text-[var(--button-text)]
                               hover:scale-105 shadow-sm transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        Назад
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 🔲 Сам блок аналізатора */}
                        <motion.div
                            key="analyzer"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-md mx-auto text-center p-6 rounded-xl shadow-md"
                            style={{ backgroundColor: "var(--card-bg)", color: "var(--text)" }}
                        >
                            <h2 className="text-xl font-bold mb-6">
                                Як Ви сьогодні почуваєтеся?
                            </h2>

                            <textarea
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                           outline-none focus:ring-2 focus:ring-blue-400 transition
                           bg-[var(--input-bg)] text-[var(--text)] placeholder-gray-400
                           resize-none mb-4"
                                rows={3}
                                placeholder="Опиши свій емоційний стан..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <button
                                onClick={analyzeMood}
                                disabled={loading}
                                className="px-8 py-3 rounded-full font-semibold text-base transition
                           bg-[var(--button-bg)] text-[var(--button-text)]
                           hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? "Аналізую..." : "Аналізувати"}
                            </button>

                            {mood && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-6 p-6 rounded-lg bg-[var(--result-bg)] shadow-inner text-left"
                                >

                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-5xl">{mood.emoji}</span>
                                        <p className="font-bold text-2xl capitalize text-[var(--text)]">
                                            {mood.label}
                                        </p>
                                    </div>


                                    {mood.analysis && (
                                        <blockquote className="mt-4 border-l-4 border-gray-400 pl-4 italic text-lg text-[var(--text)]">
                                            {mood.analysis}
                                        </blockquote>
                                    )}

                                    {mood.advice && (
                                        <p className="mt-4 text-base text-gray-700 dark:text-gray-300 font-medium">
                                            {mood.advice}
                                        </p>
                                    )}
                                </motion.div>
                            )}




                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
