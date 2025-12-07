import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ClipboardCheck, HeartPulse, BookOpen } from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


// 🟢 Overlay з плавним вирізом
function HighlightOverlay({ selector, step }) {
    const [rect, setRect] = useState(null);

    useEffect(() => {
        if (!selector) return;

        const update = () => {
            const el = document.querySelector(selector);
            if (el) {
                const r = el.getBoundingClientRect();
                setRect(r);
            }
        };

        // чекаємо поки анімація Framer Motion завершиться
        const timeout = setTimeout(update, 50);

        // оновлюємо при resize/scroll
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, [selector, step]);

    if (!rect) return null;

    const padding = 8;
    const top = rect.top - padding;
    const left = rect.left - padding;
    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;

    const clipPath = `polygon(
        0 0,
        100% 0,
        100% 100%,
        0 100%,
        0 ${top}px,
        ${left}px ${top}px,
        ${left}px ${top + height}px,
        ${left + width}px ${top + height}px,
        ${left + width}px ${top}px,
        ${left}px ${top}px,
        0 ${top}px
    )`;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 pointer-events-none"
            animate={{ clipPath }}
            initial={false}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                mass: 0.5,
            }}
        />
    );
}




export default function CabinetPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("друже");
    const [openProfile, setOpenProfile] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [user, setUser] = useState(null);
    const [onboarded, setOnboarded] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [runTour, setRunTour] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const steps = [
        { selector: ".block-chat", text: "Поговорити з Luma — тут можна спілкуватися з ШІ" },
        { selector: ".block-tests", text: "Тести — для розуміння свого емоційного стану" },
        { selector: ".block-resources", text: "Ресурсний простір — вправи для стабілізації" },
        { selector: ".block-journal", text: "Щоденник — записуйте свої думки та настрій" },
    ];

    useEffect(() => {
        if (!runTour) return;

        const html = document.documentElement;
        const body = document.body;

        const prev = {
            htmlOverflow: html.style.overflow,
            htmlScrollbarWidth: html.style.scrollbarWidth,
            bodyOverflow: body.style.overflow,
        };

        // 🔥 вставимо стилі для приховування ::-webkit-scrollbar
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-hide-scrollbars", "true");
        styleEl.innerHTML = `
    ::-webkit-scrollbar { 
      display: none !important; 
    }
  `;
        document.head.appendChild(styleEl);

        // блокуємо скрол
        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none"; // Firefox
        body.style.overflow = "hidden";

        return () => {
            // прибираємо інжектований стиль
            if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

            html.style.overflow = prev.htmlOverflow;
            html.style.scrollbarWidth = prev.htmlScrollbarWidth || "";
            body.style.overflow = prev.bodyOverflow;
        };
    }, [runTour]);


    // слухаємо юзера
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setName(u ? u.displayName || "друже" : "друже");
        });
        return () => unsub();
    }, []);

    // тягнемо профіль з Firestore
    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const ref = doc(db, "users", user.uid, "config", "profile");
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    const onboardedVal = data.onboarded || false;
                    const guideVal = data.guideCompleted || false;

                    setOnboarded(onboardedVal);
                    if (onboardedVal && !guideVal) {
                        // анкета пройдена, але гайд ще ні → запускаємо тур
                        setRunTour(true);
                    }
                } else {
                    // профіль відсутній → показати тур на всяк випадок
                    setOnboarded(false);
                    setRunTour(true);
                }

            } catch (err) {
                console.error("❌ Помилка завантаження профілю:", err);
                setOnboarded(false);
                setRunTour(true);
            }
        };
        fetchProfile();
    }, [user]);

    if (onboarded === null) return <p className="text-center mt-10">Завантаження...</p>;

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            setRunTour(false);
            setShowWelcome(true); // 🚀 показуємо вітання
            setTimeout(() => setShowWelcome(false), 3000); // через 3 сек зникне

            if (user) {
                const ref = doc(db, "users", user.uid, "config", "profile");
                await setDoc(ref, { onboarded: true }, { merge: true });
                await setDoc(ref, { guideCompleted: true }, { merge: true });
                setOnboarded(true);
            }
        }
    };


    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    return (
        <div
            className="max-w-5xl mx-auto px-4 py-8 space-y-6"
            style={{ color: "var(--text)" }}
        >
            {/* 🟢 Екран вітання */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        key="welcome"
                        className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.h1
                            initial={{ filter: "blur(20px)", opacity: 0 }}
                            animate={{ filter: "blur(0px)", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-bold text-[var(--text)]"
                        >
                            Вітаємо у Luma ✨
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🟢 Тур з підсвіткою */}
            {runTour && (
                <>
                    <HighlightOverlay
                        selector={steps[currentStep].selector}
                        step={currentStep}
                    />

                    <div
                        className="fixed bottom-10 left-1/2 -translate-x-1/2
                        bg-[var(--accent-bg)] text-[var(--text)]
                        px-6 py-5 rounded-2xl shadow-xl z-50 max-w-md text-center
                        border border-[var(--border)]"
                        >
                        <p className="mb-4 font-medium">{steps[currentStep].text}</p>

                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-[var(--text)] disabled:opacity-50"
                            >
                                Назад
                            </button>

                            <button
                                onClick={handleNext}
                                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                            >
                                {currentStep === steps.length - 1 ? "Завершити" : "Далі"}
                            </button>
                        </div>
                    </div>

                </>
            )}

            {/* 🟢 Основний контент кабінету */}
            <AnimatePresence mode="wait">
                {!openProfile && !openSettings ? (
                    <motion.div
                        key="cabinet-main"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3 rounded-xl shadow-sm"
                            style={{
                                backgroundColor: "var(--card-bg)",
                                color: "var(--card-text)",
                            }}
                        >
                            <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                                👋 Привіт,{" "}
                                <span className="font-bold">{name}</span>!
                            </h1>
                            <div className="flex items-center gap-4 text-sm">
                                <Link
                                    to="/profile"
                                    className="hover:underline"
                                >
                                    Профіль
                                </Link>

                                <Link
                                    to="/settings"
                                    className="hover:underline"
                                >
                                    Налаштування
                                </Link>

                            </div>
                        </div>

                        {/* блоки */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr mt-6">
                            <CabinetBlock
                                title="Поговорити з Luma"
                                description="Штучний інтелект вислухає, підтримає, порадить."
                                icon={<MessageSquare size={28} />}
                                onClick={() => navigate("/cabinet/chat")}
                                className="block-chat"
                            />
                            <CabinetBlock
                                title="Тести"
                                description="Короткі тести, які допоможуть краще зрозуміти свій емоційний стан."
                                icon={<ClipboardCheck size={28} />}
                                onClick={() => navigate("/cabinet/tests")}
                                className="block-tests"
                            />
                            <CabinetBlock
                                title="Ресурсний простір"
                                description="Ресурси, вправи, методики."
                                icon={<HeartPulse size={28} />}
                                onClick={() => navigate("/cabinet/resource")}
                                className="block-resources"
                            />
                            <CabinetBlock
                                title="Щоденник"
                                description="Записати настрій, подію, думку."
                                icon={<BookOpen size={28} />}
                                onClick={() => navigate("/cabinet/journal")}
                                className="block-journal"
                            />
                        </section>
                    </motion.div>
                ) : openProfile ? (
                    <ProfilePage
                        onBack={() => setOpenProfile(false)}
                        onNameChange={(newName) => setName(newName)}
                    />
                ) : (
                    <SettingsPage onBack={() => setOpenSettings(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function CabinetBlock({ title, description, icon, onClick, className }) {
    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-2xl shadow-sm cursor-pointer transition-transform transform hover:scale-[1.02] hover:shadow-lg duration-300 ${className}`}
            style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
        >
            <div className="flex flex-col justify-between h-full">
                <div className="flex justify-end" style={{ color: "var(--text)" }}>
                    {icon}
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold text-lg">{title}</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--card-text)" }}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
