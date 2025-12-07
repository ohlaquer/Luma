import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 додаємо useNavigate
import { Eye, EyeOff } from "lucide-react";
import logo from "/luma-logo-light.svg";
import { signIn } from "../services/auth";
import Toast from "../components/Toast";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // 👈 хук навігації

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Заповни всі поля"); // або можна взагалі викинути цю перевірку
            return;
        }
        try {
            await signIn(email, password);
            navigate("/cabinet");
        } catch (err) {
            alert("Помилка: " + err.message); // або заміниш на свій тост
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
                <h1
                    className="text-2xl font-bold mb-6 mt-4"
                    style={{ color: "var(--text)" }}
                >
                    Раді вас бачити!
                </h1>

                <form
                    className="space-y-4 flex-grow flex flex-col justify-center"
                    onSubmit={(e) => e.preventDefault()}
                >
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

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all"
                            style={{
                                backgroundColor: "var(--card-bg)",
                                color: "var(--text)",
                                borderColor: "var(--hover)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center opacity-60 hover:opacity-100"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full px-6 py-3 rounded-full font-semibold transition"
                        style={{
                            backgroundColor: "var(--button-bg)",
                            color: "var(--button-text)",
                        }}
                    >
                        Увійти
                    </button>
                </form>

                {/* Посилання */}
                <div className="mt-6 flex justify-between text-sm px-1">
                    <Link
                        to="/register"
                        className="hover:underline transition"
                        style={{ color: "var(--accent, #5B7DB1)" }}
                    >
                        Реєстрація
                    </Link>
                    <Link
                        to="/forgot-password"
                        className="hover:underline transition"
                        style={{ color: "var(--accent, #5B7DB1)" }}
                    >
                        Забули пароль?
                    </Link>
                </div>
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
