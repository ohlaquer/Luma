import { Link } from "react-router-dom";
import {
    Home,
    MessageCircle,
    BookText,
    Activity,
    FolderKanban,
    User,
    Sparkles,
    ShieldCheck,
    Info
} from "lucide-react";

const sections = [
    {
        name: "Головна сторінка",
        desc: "Поле вводу, аналіз емоцій, структура інтерфейсу.",
        to: "/guide/home",
        icon: <Home className="w-7 h-7" />,
    },
    {
        name: "Чат з Luma",
        desc: "Повідомлення, фото, памʼять, бокова панель.",
        to: "/guide/chat",
        icon: <MessageCircle className="w-7 h-7" />,
    },
    {
        name: "Щоденник",
        desc: "Теги, настрої, кольори, модалка, PDF.",
        to: "/guide/journal",
        icon: <BookText className="w-7 h-7" />,
    },
    {
        name: "Ресурсний простір",
        desc: "Вправи, методики, відео, арт-практики.",
        to: "/guide/resources",
        icon: <Activity className="w-7 h-7" />,
    },
    {
        name: "Тести",
        desc: "Проходження, варіанти, результати.",
        to: "/guide/tests",
        icon: <FolderKanban className="w-7 h-7" />,
    },
    {
        name: "Профіль та налаштування",
        desc: "Налаштування акаунту, імʼя, пароль.",
        to: "/guide/profile",
        icon: <User className="w-7 h-7" />,
    },
    {
        name: "Онбординг",
        desc: "Анкета, перші кроки, гайд функцій.",
        to: "/guide/onboarding",
        icon: <Sparkles className="w-7 h-7" />,
    },
    {
        name: "Безпека",
        desc: "Приватність, шифрування, збереження даних.",
        to: "/guide/safety",
        icon: <ShieldCheck className="w-7 h-7" />,
    },
    {
        name: "Про Luma",
        desc: "Філософія сервісу та основні принципи.",
        to: "/guide/about",
        icon: <Info className="w-7 h-7" />,
    },
];

export default function GuidePage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">

            <h1 className="text-3xl font-bold mb-8 text-[var(--text)]">
                Довідник Luma
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections.map((s, i) => (
                    <Link
                        key={i}
                        to={s.to}
                        className="
                            p-5 rounded-xl shadow-md border
                            hover:scale-[1.02] transition
                            bg-[var(--card-bg)]
                            border-[var(--hover)]
                            text-[var(--text)]
                        "
                    >
                        <div className="mb-3 text-[var(--text)]">
                            {s.icon}
                        </div>

                        <h2 className="font-semibold text-lg">
                            {s.name}
                        </h2>

                        <p className="text-sm opacity-70 mt-1">
                            {s.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
