import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import AccessibilitySettings from "../components/AccessibilitySettings";
import ThemeToggleIconButton from "../components/ThemeToggleIconButton";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";
import { motion, AnimatePresence } from "framer-motion";

const routes = [
    { path: "/", name: "Головна" },
    { path: "/guide", name: "Довідник" },
    { path: "/policy", name: "Політика і безпека" },
    { path: "/support", name: "Психологічна підтримка" },
];

export default function MobileHeader() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="md:hidden relative z-50 bg-[var(--accent-bg)] text-[var(--text)] transition-colors">
            {/* Верхня панель */}
            <div className="flex items-center justify-between px-4 py-3">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
                    <img src="/luma-logo-light.svg" alt="Luma" className="h-8 dark:hidden" />
                    <img src="/luma-logo-dark.svg" alt="Luma dark" className="h-8 hidden dark:block" />
                </Link>

                <div className="flex items-center gap-3">
                    <AccessibilitySettings />
                    <ThemeToggleIconButton />
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Відкрити меню"
                        className="focus:outline-none"
                    >
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Дропдаун меню */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-4 top-[64px] w-[230px] rounded-2xl border border-[var(--highlight-border)] bg-[var(--card-bg)]/80 backdrop-blur-xl shadow-lg flex flex-col items-center overflow-hidden"
                    >
                        <nav className="w-full flex flex-col text-center text-[var(--text)] text-base font-medium">
                            {routes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`py-3 px-3 transition rounded-md mx-2 my-[2px] ${
                                        location.pathname === route.path
                                            ? "bg-[var(--highlight-bg)] font-semibold"
                                            : "hover:bg-[var(--highlight-bg)]"
                                    }`}
                                >
                                    {route.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="w-full border-t border-[var(--highlight-border)] mt-1 px-4 py-3 flex flex-col gap-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex justify-center items-center h-10 border border-[var(--text)] rounded-xl text-sm font-semibold hover:bg-[var(--highlight-bg)] transition"
                                    >
                                        Увійти
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex justify-center items-center h-10 bg-[var(--highlight-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--highlight-border)] transition"
                                    >
                                        Зареєструватися
                                    </Link>
                                </>
                            ) : (
                                <div className="flex flex-col items-center w-full gap-3 py-2">

                                    {/* Аватар */}
                                    <div className="flex justify-center w-full">
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="w-12 h-12 rounded-full bg-[var(--highlight-bg)] flex items-center justify-center hover:bg-[var(--highlight-border)] transition overflow-hidden"
                                        >
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={24} className="text-[var(--text)]" />
                                            )}
                                        </Link>
                                    </div>

                                    {/* Кабінет */}
                                    <Link
                                        to="/cabinet"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex justify-center items-center h-10 w-full bg-[var(--highlight-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--highlight-border)] transition"
                                    >
                                        Кабінет
                                    </Link>

                                    {/* Вийти */}
                                    <button
                                        onClick={() => {
                                            setShowLogout(true);
                                            setMenuOpen(false);
                                        }}
                                        className="flex justify-center items-center h-10 w-full border border-[var(--text)] rounded-xl text-sm font-semibold hover:bg-[var(--highlight-bg)] transition"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Модалка виходу */}
            <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
        </header>
    );
}
