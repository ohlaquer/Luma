import { useState, useEffect} from "react";
import { Video, Repeat2, Lightbulb, X } from "lucide-react";
import BackLink from "../components/BackLink";

export default function BodyPage() {
    const [videoUrl, setVideoUrl] = useState(null);
    useEffect(() => {
        if (!videoUrl) return;

        const scrollY = window.scrollY;
        const html = document.documentElement;
        const scrollBarWidth = window.innerWidth - html.clientWidth;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none";

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

            window.scrollTo(0, scrollY);
        };
    }, [videoUrl]);

    const practices = [
        {
            title: "Grounding: відчуй опору під ногами",
            steps: [
                "Встань, постав ноги рівно на підлогу",
                "Відчуй вагу тіла, як п’яти і пальці торкаються поверхні",
                "Злегка погойдюйся вперед-назад, вліво-вправо",
                "Скажи собі: “Я тут. Я у своєму тілі. Я в безпеці.”",
            ],
            duration: "Повторювати 1–2 хвилини",
            video: "https://www.youtube.com/embed/lzKWC67nWDA", // 👈 твоє відео
        },
        {
            title: "Progressive Relaxation (прогресивне розслаблення)",
            steps: [
                "Напруж одну групу м’язів (наприклад, кулак) на 5 секунд",
                "Потім різко розслаб",
                "Перейдіть до наступної: плечі, шия, обличчя, живіт тощо",
                "Відчуй контраст напруга ↔ розслаблення",
            ],
            duration: "Робити 1–2 хвилини або до відчуття \"розм'якшення\"",
            video: null, // 👈 без кнопки
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

        <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                    <BackLink />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
                    Тілесні практики
                </h1>

                <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                    Чому важливо працювати з тілом – і як це робити м’яко?
                </p>

                <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
                    <p className="italic mb-2">
                        Коли ми тривожимось, тіло стискається, дихає поверхнево й «зависає» в режимі захисту.
                        <br />
                        Але саме через тіло можна вийти з цього стану: розслабитись, відчути опору і повернути контроль.
                    </p>
                    <p className="font-semibold">
                        <em>“Тіло — це якір для розуму в штормі.”</em>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {[
                        "Відновлює контакт із тілом",
                        "Регулює серцебиття і дихання",
                        "Заземлює та стабілізує стан",
                        "Знижує м'язову напругу",
                        'Допомагає “вийти з голови”',
                    ].map((tag, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
                        >
                            {tag}
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-semibold mb-4 text-center text-custom-blue dark:text-white">
                    Практики руху тіла
                </h2>

                {practices.map((practice, index) => (
                    <div
                        key={index}
                        className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10"
                    >
                        <h3 className="font-semibold text-custom-blue dark:text-white">
                            {practice.title}
                        </h3>
                        <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                            {practice.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ul>
                        <p className="flex items-center gap-2 text-sm text-custom-blue dark:text-white">
                            <Repeat2 size={16} /> {practice.duration}
                        </p>
                        <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
                            <Lightbulb size={16} className="mt-1" />
                            Виконуй тілесні практики у тихому просторі. Можна приглушити світло або увімкнути спокійні звуки (дощ, вітер, море).
                        </p>
                        {practice.video && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setVideoUrl(practice.video)}
                                    className="flex items-center gap-2 mt-4 px-5 py-2 rounded-full shadow-sm transition-all
                    bg-blue-100 text-blue-600 hover:bg-blue-200
                    dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                >
                                    <Video size={18} /> Відкрити відео
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {/* Модалка з відео */}
                {videoUrl && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-hidden">
                        <div className="bg-white dark:bg-[#10142c] rounded-2xl p-4 max-w-3xl w-full relative">
                            <button
                                onClick={() => setVideoUrl(null)}
                                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
                            >
                                <X size={24} />
                            </button>
                            <div className="relative rounded-2xl overflow-hidden shadow-lg border dark:border-white/10">
                                <iframe
                                    className="w-full h-[400px]"
                                    src={videoUrl}
                                    title="Practice video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
