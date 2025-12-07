import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import AccessibilitySettings from "../components/AccessibilitySettings";
import ThemeToggleIconButton from "../components/ThemeToggleIconButton";
import { motion, AnimatePresence } from "framer-motion";


import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";

const routes = [
    { path: "/", name: "Головна" },
    { path: "/guide", name: "Довідник" },
    { path: "/policy", name: "Політика і безпека" },
    { path: "/support", name: "Психологічна підтримка" },
];

export default function DesktopHeader() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { user } = useAuth();

    // 👇 стан для модалки
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="desktop-header hidden md:flex relative items-center justify-between px-6 lg:px-12 h-24 bg-[var(--accent-bg)] text-[var(--text)] transition-colors w-full z-10">
        {/* Логотип */}
            <Link
                to="/"
                className="w-32 sm:w-40 h-12 flex-shrink-0 z-10 relative block"
            >
                <img
                    src="/luma-logo-light.svg"
                    alt="Luma Logo Light"
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-150 light-visible"
                />
                <img
                    src="/luma-logo-dark.svg"
                    alt="Luma Logo Dark"
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-150 dark-visible"
                />
            </Link>


            {/* Навбар */}
            <nav className="hidden [@media(min-width:1440px)]:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="px-6 lg:px-8 py-3 rounded-full shadow-md flex items-center gap-5 text-base lg:text-lg font-medium transition-colors whitespace-nowrap bg-[var(--card-bg)] text-[var(--card-text)]">
                    {routes.map((route) => {
                        const isActive = location.pathname === route.path;
                        return (
                            <div key={route.path} className="relative">
                                <Link
                                    to={route.path}
                                    className={`relative z-10 px-4 py-2 rounded-full truncate transition-colors ${
                                        isActive
                                            ? "text-[var(--text)] font-semibold"
                                            : "text-[var(--text)] opacity-70 hover:bg-[var(--highlight-bg)]"
                                    }`}
                                >
                                    {route.name}
                                </Link>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-full z-0 pointer-events-none bg-[var(--highlight-bg)]"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Правий блок */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 z-10 relative">
                <AccessibilitySettings />
                <ThemeToggleIconButton />

                <div className="hidden [@media(min-width:1440px)]:flex items-center gap-3">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="text-[var(--text)] text-sm sm:text-base hover:underline transition"
                            >
                                Увійти
                            </Link>
                            <Link
                                to="/register"
                                className="bg-[var(--highlight-bg)] hover:bg-[var(--highlight-border)] text-[var(--text)] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition whitespace-nowrap"
                            >
                                Зареєструватися
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* Аватарка */}
                            <Link
                                to="/profile"
                                className="w-10 h-10 rounded-full bg-[var(--highlight-bg)] flex items-center justify-center hover:bg-[var(--highlight-border)] transition overflow-hidden"
                            >
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={22} className="text-[var(--text)]" />
                                )}
                            </Link>


                            <div className="flex flex-col gap-1 mt-[25px]">
                                <Link
                                    to="/cabinet"
                                    className="px-4 py-1.5 rounded-full bg-[var(--highlight-bg)] hover:bg-[var(--highlight-border)] transition text-sm sm:text-base text-[var(--text)] text-center"
                                >
                                    Кабінет
                                </Link>
                                <button
                                    onClick={() => setShowLogout(true)}
                                    className="text-sm text-[#E56A6A] hover:underline mt-1 cursor-pointer inline-block"
                                >
                                    Вийти
                                </button>

                            </div>
                        </div>

                    )}
                </div>


                {/* Бургер */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="inline-block [@media(min-width:1440px)]:hidden ml-2"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-[3.5rem] w-64 backdrop-blur-md border rounded-xl shadow-lg py-4 px-5 flex flex-col gap-3 z-50 bg-[var(--card-bg)] text-[var(--card-text)] border-[var(--highlight-border)]"
                        >
                            {routes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                                        location.pathname === route.path
                                            ? "bg-[var(--highlight-bg)] text-[var(--text)]"
                                            : "text-[var(--text)] hover:bg-[var(--highlight-border)]"
                                    }`}
                                >
                                    {route.name}
                                </Link>
                            ))}
                            {/* Аватарка / іконка користувача у бургері */}
                            {user ? (
                                <div className="flex flex-col items-center gap-4 py-4 border-t border-[var(--highlight-border)]">

                                    {/* Аватарка */}
                                    <Link
                                        to="/profile"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-16 h-16 rounded-full bg-[var(--highlight-bg)] flex items-center justify-center hover:bg-[var(--highlight-border)] transition overflow-hidden"
                                    >
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={30} className="text-[var(--text)]" />
                                        )}
                                    </Link>

                                    {/* Кнопка Кабінет */}
                                    <Link
                                        to="/cabinet"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full text-center px-4 py-2 rounded-full bg-[var(--highlight-bg)] hover:bg-[var(--highlight-border)] transition text-[var(--text)] font-medium"
                                    >
                                        Кабінет
                                    </Link>

                                    {/* Кнопка Вийти */}
                                    <button
                                        onClick={() => {
                                            setShowLogout(true);
                                            setMenuOpen(false);
                                        }}
                                        className="text-sm text-[#E56A6A] hover:underline"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 py-4 border-t border-[var(--highlight-border)]">
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full text-center px-4 py-2 rounded-full bg-[var(--highlight-bg)] hover:bg-[var(--highlight-border)] transition text-[var(--text)] font-medium"
                                    >
                                        Увійти
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full text-center px-4 py-2 rounded-full border border-[var(--highlight-border)] text-[var(--text)] hover:bg-[var(--hover)] transition font-medium"
                                    >
                                        Зареєструватися
                                    </Link>
                                </div>
                            )}


                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Модалка виходу */}
            <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
        </header>
    );
}
