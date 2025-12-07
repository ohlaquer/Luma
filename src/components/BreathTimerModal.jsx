import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "./breath-animation.css";

export default function BreathTimerModal({
                                             open,
                                             onClose,
                                             steps = [],
                                             repeats = 4,
                                         }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [countdown, setCountdown] = useState(steps?.[0]?.duration ?? 0);
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState("intro"); // intro | practice | done
    const [preStart, setPreStart] = useState(false);

    useEffect(() => {
        if (phase !== "practice" || !running || !open || !steps.length) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    const nextStep = stepIndex + 1;

                    if (nextStep < steps.length) {
                        setStepIndex(nextStep);
                        return steps[nextStep].duration;
                    } else {
                        const nextCycle = cycle + 1;
                        if (nextCycle > repeats) {
                            setRunning(false);
                            setPhase("done");
                            return 0;
                        } else {
                            setCycle(nextCycle);
                            setStepIndex(0);
                            return steps[0].duration;
                        }
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [running, countdown, stepIndex, steps, cycle, repeats, open, phase]);

    useEffect(() => {
        if (open && steps.length > 0) {
            setStepIndex(0);
            setCountdown(steps[0]?.duration ?? 0);
            setCycle(1);
            setRunning(false);
            setPhase("intro");
        }
    }, [open, steps]);

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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        className="bg-white dark:bg-[#10142c] text-[var(--text)] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border dark:border-[var(--hover)] p-6 relative flex flex-col items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{
                            minHeight:
                                phase === "intro"
                                    ? 200
                                    : phase === "practice"
                                        ? 520
                                        : 260,
                        }}
                    >
                        {/* Закрити */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                        >
                            <X size={20} />
                        </button>

                        {/* Контент з fade */}
                        <AnimatePresence mode="wait">
                            {phase === "intro" && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center space-y-4"
                                >
                                    <h2 className="text-xl font-bold">Готовий розпочати?</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Сядь зручно, розслаб плечі і готуйся до вправи.
                                        Натисни кнопку, коли будеш готовий.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setPhase("practice");           // переходимо в практику
                                            setPreStart(true);              // 1) коло буде маленьке
                                            setRunning(false);              // таймер ще не біжить
                                            setStepIndex(0);                // готуємо перший крок
                                            setCountdown(steps[0]?.duration ?? 0);

                                            setTimeout(() => {              // 2) через 1с запускаємо
                                                setPreStart(false);           // дозволяємо рости
                                                setRunning(true);             // вмикаємо відлік
                                            }, 1000);                       // <-- тут твоя «секунда малим»
                                        }}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                                    >
                                        Старт
                                    </button>


                                </motion.div>
                            )}

                            {phase === "practice" && (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    {/* Кільця */}
                                    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                                        <div
                                            className="absolute rounded-full bg-blue-300/40"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                border: "1.5px solid rgba(147, 197, 253, 0.5)",
                                                zIndex: 2,
                                            }}
                                        ></div>

                                        {[1, 2, 3, 4, 5].map((i) => {
                                            const ringSize = 100 + i * 35;
                                            const opacity = 0.3 - (i - 1) * 0.04;
                                            const currentLabel = steps[stepIndex]?.label?.toLowerCase() || "пауза";

// якщо preStart увімкнено — тримаємо мале коло незалежно від кроку
                                            const targetScale =
                                                currentLabel === "вдих" || currentLabel === "затримка" ? 1.35 : 1;

                                            const scale = preStart ? 1 : targetScale;


                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute rounded-full anim-orbit"
                                                    style={{
                                                        width: `${ringSize}px`,
                                                        height: `${ringSize}px`,
                                                        backgroundColor: `rgba(147, 197, 253, ${opacity})`,
                                                        border: `1.5px solid rgba(147, 197, 253, ${opacity + 0.2})`,
                                                        transform: `scale(${scale})`,
                                                        transition: `transform ${steps[stepIndex]?.duration || 4}s ease-in-out`,
                                                        zIndex: 1,
                                                        boxShadow: `0 0 10px rgba(147, 197, 253, ${opacity})`,
                                                    }}

                                                ></div>
                                            );
                                        })}
                                    </div>

                                    {/* Лейбл + таймери разом */}
                                    <div className="flex flex-col items-center gap-1 mt-4">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">
                                            {steps[stepIndex]?.label}
                                        </span>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Залишилось: {countdown}s
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Цикл {cycle} з {repeats}
                                        </p>
                                    </div>

                                </motion.div>
                            )}


                            {phase === "done" && (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center space-y-4"
                                >
                                    <h2 className="text-xl font-bold">Практику завершено!</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Твоє дихання стало рівним, а тіло розслабленим.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                                    >
                                        Готово
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
