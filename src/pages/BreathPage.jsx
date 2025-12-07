// src/pages/BreathPage.jsx
import { useState } from "react";
import { AlarmClock, Repeat2, Lightbulb } from "lucide-react";
import BackLink from "../components/BackLink";
import BreathTimerModal from "../components/BreathTimerModal";

export default function BreathPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSteps, setCurrentSteps] = useState([]);

    const openTimer = (steps) => {
        setCurrentSteps(steps);
        setIsOpen(true);
    };

    const practices = [
        {
            title: "Box Breathing (4-4-4-4)",
            steps: [
                { label: "Вдих", duration: 4 },
                { label: "Затримка", duration: 4 },
                { label: "Видих", duration: 4 },
                { label: "Пауза", duration: 4 },
            ],
            note: "Можна уявляти квадрат — кожна сторона відповідає фазі дихання",
            tip: "Ця вправа використовується в армії США для швидкого відновлення після стресу. Підходить для стабілізації після сильного хвилювання або перед важливою подією.",
        },
        {
            title: "Дихання 4-7-8",
            steps: [
                { label: "Вдих", duration: 4 },
                { label: "Затримка", duration: 7 },
                { label: "Видих", duration: 8 },
            ],
            note: "Чудово підходить перед сном",
            tip: "Допомагає розслабитися, зняти напругу і заснути. Заспокоює нервову систему.",
        },
        {
            title: "Дихання животом",
            steps: [
                { label: "Вдих", duration: 5 },
                { label: "Видих", duration: 5 },
            ],
            note: "Практика заспокоює нервову систему",
            tip: "Повертає увагу в тіло та допомагає зняти внутрішню напругу. Добре працює при тривозі.",
        },
        {
            title: "Ритмічне дихання (метроном)",
            steps: [
                { label: "Вдих", duration: 5 },
                { label: "Видих", duration: 5 },
            ],
            note: "Практика заспокоює нервову систему",
            tip: "Допомагає вирівняти дихання та ритм серця. Ефективна при стресі або підвищеній збудженості.",
        },
        {
            title: "3-2-5 (швидке заспокоєння)",
            steps: [
                { label: "Вдих", duration: 3 },
                { label: "Затримка", duration: 2 },
                { label: "Видих", duration: 5 },
            ],
            note: "Простий цикл для швидкого ефекту",
            tip: "Ця вправа ефективна при раптовому стресі або тривожному нападі. Знижує інтенсивність емоцій за лічені хвилини.",
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
        <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                    <BackLink />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
                    Дихальні вправи
                </h1>

                <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                    Коли ми починаємо глибоко дихати — мозок отримує сигнал, що все гаразд.
                    Ми знижуємо напругу і повертаємось у момент.
                </p>

                <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
                    <p className="italic mb-2">
                        Дихання — це наш пульт регуляції. Його можна заспокоїти, уповільнити чи збалансувати.
                    </p>
                    <p className="font-semibold">
                        <em>“Твоє дихання — твій якор.”</em>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {[
                        "Знижує рівень кортизолу",
                        "Вирівнює серцебиття",
                        "Заспокоює панічні стани",
                        "Допомагає заснути",
                        "Повертає увагу в тіло",
                    ].map((tag, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
                        >
                            {tag}
                        </div>
                    ))}
                </div>

                {practices.map((p, i) => (
                    <div
                        key={i}
                        className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10"
                    >
                        <h3 className="font-semibold text-custom-blue dark:text-white">
                            {p.title}
                        </h3>
                        <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                            {p.steps.map((s, j) => (
                                <li key={j}>{`${s.label} — ${s.duration}с`}</li>
                            ))}
                        </ul>
                        <p className="flex items-center gap-2 text-sm text-custom-blue dark:text-white">
                            <Repeat2 size={16} /> {p.note}
                        </p>
                        <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
                            <Lightbulb size={16} className="mt-1" /> {p.tip}
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => openTimer(p.steps)}
                                className="flex items-center gap-2 mt-4 px-5 py-2 rounded-full shadow-sm transition-all
                bg-blue-100 text-blue-600 hover:bg-blue-200
                dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            >
                                <AlarmClock size={18} /> Запустити таймер
                            </button>
                        </div>
                    </div>
                ))}

                {/* 🌀 МОДАЛКА */}
                <BreathTimerModal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    steps={currentSteps}
                    repeats={4}
                />
            </div>
        </div>
    );
}
