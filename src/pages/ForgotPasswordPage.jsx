import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/luma-logo-light.svg";
import { resetPassword } from "../services/auth";
import Toast from "../components/Toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async () => {
        if (!email) {
            setMessage("Введи email");
            return;
        }
        try {
            await resetPassword(email);
            setMessage("Лист із відновленням надіслано");
        } catch (err) {
            setMessage("Помилка: " + err.message);
        }
    };

    return (
        <section className="relative flex justify-center items-center w-full px-4">
            <div
                className="rounded-3xl shadow-md text-center p-8 flex flex-col w-[366px] h-[482.16px] lg:w-[448px]"
                style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--card-text)",
                    borderColor: "var(--hover)",
                }}
            >
                {/* Лого */}
                <div>
                    <img src={logo} alt="Luma Logo" className="mx-auto w-20 dark:hidden" />
                    <img
                        src="/luma-logo-dark.svg"
                        alt="Luma Logo Dark"
                        className="mx-auto w-20 hidden dark:block"
                    />
                </div>

                {/* Контент */}
                <div className="w-full">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
                        Відновлення паролю
                    </h1>

                    <p className="text-sm mb-4 px-2" style={{ color: "var(--card-text)" }}>
                        Введіть свою електронну пошту, і ми надішлемо інструкції з відновлення.
                    </p>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                            style={{
                                backgroundColor: "var(--card-bg)",
                                color: "var(--text)",
                                borderColor: "var(--hover)",
                            }}
                        />

                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full px-6 py-3 rounded-full font-semibold transition"
                            style={{
                                backgroundColor: "var(--button-bg)",
                                color: "var(--button-text)",
                            }}
                        >
                            Надіслати посилання
                        </button>
                    </form>
                </div>

                {/* Посилання назад */}
                <p className="text-sm mt-4" style={{ color: "var(--text)" }}>
                    <Link
                        to="/login"
                        className="hover:underline transition"
                        style={{ color: "var(--accent, #5B7DB1)" }}
                    >
                        Назад до входу
                    </Link>
                </p>
            </div>

            {/* Тост ПІД блоком */}
            {message && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2">
                    <Toast message={message} onClose={() => setMessage("")} />
                </div>
            )}
        </section>
    );
}
