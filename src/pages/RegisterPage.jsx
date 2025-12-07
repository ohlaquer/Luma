import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 додав useNavigate
import { Eye, EyeOff } from "lucide-react";
import logo from "/luma-logo-light.svg";
import { signUp } from "../services/auth";
import Toast from "../components/Toast";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // 👈 ініціалізація

    const handleRegister = async () => {
        if (!email || !password || !confirm || !name) {
            setMessage("Заповни всі поля");
            return;
        }
        if (password !== confirm) {
            setMessage("Паролі не співпадають");
            return;
        }
        try {
            // створюємо юзера
            const userCred = await signUp(email, password);

            // оновлюємо профіль, додаємо псевдонім
            await updateProfile(userCred.user, {
                displayName: name,
            });

            await sendEmailVerification(userCred.user);
            console.log("📧 Лист підтвердження надіслано:", userCred.user.email);

            console.log("Зареєстровано як:", userCred.user.displayName);

            navigate("/cabinet"); // редірект
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

                {/* Заголовок */}
                <h1 className="text-2xl font-bold mb-4 mt-4" style={{ color: "var(--text)" }}>
                    Вітаємо!
                </h1>

                {/* Форма */}
                <form
                    className="space-y-4 flex-grow flex flex-col justify-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="text"
                        placeholder="Ім’я / псевдонім"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            color: "var(--text)",
                            borderColor: "var(--hover)",
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            color: "var(--text)",
                            borderColor: "var(--hover)",
                        }}
                    />

                    {/* Пароль */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border pr-10 focus:outline-none focus:ring-2"
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

                    {/* Підтвердження паролю */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Підтвердіть пароль"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border pr-10 focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: "var(--card-bg)",
                                color: "var(--text)",
                                borderColor: "var(--hover)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-3 flex items-center opacity-60 hover:opacity-100"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Кнопка */}
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full px-6 py-3 rounded-full font-semibold transition hover:brightness-105"
                        style={{
                            backgroundColor: "var(--button-bg)",
                            color: "var(--button-text)",
                        }}
                    >
                        Зареєструватися
                    </button>
                </form>

                {/* Посилання */}
                <p className="text-sm mt-4" style={{ color: "var(--muted-text)" }}>
                    <Link
                        to="/login"
                        className="hover:underline transition"
                        style={{ color: "var(--accent, #5B7DB1)" }}
                    >
                        У мене вже є обліковий запис
                    </Link>
                </p>
            </div>
            {/* Повідомлення під блоком */}
            {message && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2">
                    <Toast message={message} onClose={() => setMessage("")} />
                </div>
            )}
        </section>
    );
}
