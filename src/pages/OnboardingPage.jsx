// src/pages/OnboardingPage.jsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Toast from "../components/Toast";
import { encrypt } from "../utils/secure";
import { Listbox } from "@headlessui/react";

// 🌀 Універсальний округлий селект
function RoundedSelect({ label, value, onChange, options }) {
    return (
        <div className="mb-4">
            <label className="block text-sm mb-1">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="w-full px-3 py-2 rounded-2xl border bg-[var(--input-bg)] text-[var(--text)] text-left">
                        {options.find((o) => o.value === value)?.label}
                    </Listbox.Button>

                    <Listbox.Options
                        className="
                            absolute mt-1 w-full rounded-2xl
                            bg-white dark:bg-[#1e293b] text-[var(--text)]
                            shadow-xl z-[9999] overflow-hidden
                            border border-gray-300 dark:border-gray-600
                        "
                    >
                        {options.map((opt) => (
                            <Listbox.Option
                                key={opt.value}
                                value={opt.value}
                                className={({ active, selected }) =>
                                    `px-3 py-2 cursor-pointer select-none transition-colors
                                    ${active ? "bg-[var(--highlight-bg)]" : ""}
                                    ${selected ? "font-semibold" : ""}`
                                }
                            >
                                {opt.label}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}

export default function OnboardingPage() {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("other");
    const [occupation, setOccupation] = useState("");
    const [therapyExperience, setTherapyExperience] = useState("no");
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const saveProfile = async () => {
        if (!auth.currentUser) {
            setToastMessage("❌ Ви не залогінені");
            return;
        }
        if (!age) {
            setToastMessage("❌ Вкажіть свій вік");
            return;
        }

        try {
            setLoading(true);
            const ref = doc(db, "users", auth.currentUser.uid, "config", "profile");
            await setDoc(ref, {
                age: Number(age),
                gender,
                occupation: encrypt(occupation),
                therapyExperience: encrypt(therapyExperience),
                onboarded: true,
                guideCompleted: false,
                createdAt: new Date(),
            });

            setToastMessage("✅ Анкета збережена!");
            setLoading(false);
            window.location.href = "/cabinet";
        } catch (err) {
            console.error("❌ Помилка збереження анкети:", err);
            setToastMessage("❌ Не вдалося зберегти анкету");
            setLoading(false);
        }
    };

    return (
        <section className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-[var(--card-bg)] text-[var(--text)]">
            <h2 className="text-xl font-semibold mb-6">Анкета користувача</h2>

            {/* Вік */}
            <div className="mb-4">
                <label className="block text-sm mb-1">Вік</label>
                <input
                    type="number"
                    min="10"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border bg-[var(--input-bg)]"
                />
            </div>

            {/* Стать */}
            <RoundedSelect
                label="Стать"
                value={gender}
                onChange={setGender}
                options={[
                    { value: "male", label: "Чоловіча" },
                    { value: "female", label: "Жіноча" },
                    { value: "other", label: "Інше" },
                    { value: "none", label: "Не хочу вказувати" },
                ]}
            />

            {/* Сфера діяльності */}
            <div className="mb-4">
                <label className="block text-sm mb-1">Сфера діяльності</label>
                <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Студент, робота тощо"
                    className="w-full px-3 py-2 rounded-2xl border bg-[var(--input-bg)]"
                />
            </div>

            {/* Досвід терапії */}
            <RoundedSelect
                label="Чи був досвід психотерапії?"
                value={therapyExperience}
                onChange={setTherapyExperience}
                options={[
                    { value: "no", label: "Ні" },
                    { value: "yes", label: "Так" },
                    { value: "none", label: "Не хочу вказувати" },
                ]}
            />

            {/* Кнопка */}
            <button
                onClick={saveProfile}
                disabled={loading}
                className="w-full px-4 py-2 rounded-2xl text-sm bg-blue-500 text-white"
            >
                {loading ? "Збереження..." : "Завершити"}
            </button>

            <Toast
                message={toastMessage}
                duration={3000}
                onClose={() => setToastMessage("")}
            />
        </section>
    );
}
