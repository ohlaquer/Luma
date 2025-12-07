// D:\LUMA\src\pages\SettingsPage.jsx
import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Toast from "../components/Toast";
import ToggleSwitch from "../components/ToggleSwitch";
import { useNavigate } from "react-router-dom";

// 🟢 Універсальний селект
function RoundedSelect({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    {/* Тригер */}
                    <Listbox.Button className="w-full px-3 py-2 rounded-2xl border bg-[var(--input-bg)] text-[var(--text)] text-left">
                        {options.find((o) => o.value === value)?.label}
                    </Listbox.Button>

                    {/* Меню */}
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

export default function SettingsPage({ onBack }) {
    const [gender, setGender] = useState("neutral");
    const [formality, setFormality] = useState("ви");
    const [tone, setTone] = useState("calm");
    const [humor, setHumor] = useState(false);
    const [swearing, setSwearing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    // 📥 Автопідвантаження налаштувань з Firestore
    useEffect(() => {
        if (!auth.currentUser) return;

        const fetchSettings = async () => {
            const ref = doc(db, "users", auth.currentUser.uid, "config", "settings");
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setGender(data.gender || "neutral");
                setFormality(data.formality || "ви");
                setTone(data.tone || "calm");
                setHumor(!!data.humor);
                setSwearing(!!data.swearing);
            }

            // 👇 Тягнемо профіль (онбординг)
            const profileRef = doc(db, "users", auth.currentUser.uid, "config", "profile");
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                setProfileData(profileSnap.data());
            }
        };

        fetchSettings();
    }, []);


    // 💾 Збереження у Firestore
    const saveAll = async () => {
        if (!auth.currentUser) {
            setToastMessage("❌ Ви не залогінені");
            return;
        }

        const ref = doc(db, "users", auth.currentUser.uid, "config", "settings");
        await setDoc(ref, {
            gender,
            formality,
            tone,
            humor,
            swearing,
            updatedAt: new Date(),
        });

        setToastMessage("✅ Налаштування збережено!");
    };


    return (
        <section className="w-full max-w-3xl mx-auto">
            <div
                className="p-6 space-y-8 rounded-3xl shadow-sm"
                style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text)",
                }}
            >
                {/* Верхній рядок */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/cabinet")}
                        className="px-4 py-2 rounded-xl text-sm
          bg-[var(--neutral-bg)] text-[var(--text)]
          hover:bg-[var(--highlight-bg)] transition"
                    >
                        Назад
                    </button>

                    <button
                        onClick={saveAll}
                        className="px-4 py-2 rounded-xl text-sm
          bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        Зберегти
                    </button>
                </div>

                <h2 className="text-xl font-semibold">Персоналізація Luma</h2>

                <div className="space-y-6">
                    {/* Стать */}
                    <RoundedSelect
                        label="Стать"
                        value={gender}
                        onChange={setGender}
                        options={[
                            { value: "female", label: "Жіноча" },
                            { value: "male", label: "Чоловіча" },
                            { value: "neutral", label: "Нейтральна" },
                        ]}
                        className="rounded-xl shadow-sm"
                    />

                    {/* Стиль звертання */}
                    <RoundedSelect
                        label="Стиль звертання"
                        value={formality}
                        onChange={setFormality}
                        options={[
                            { value: "ти", label: "«Ти»" },
                            { value: "ви", label: "«Ви»" },
                        ]}
                        className="rounded-xl shadow-sm"
                    />

                    {/* Тон відповідей */}
                    <RoundedSelect
                        label="Тон відповідей"
                        value={tone}
                        onChange={setTone}
                        options={[
                            { value: "calm", label: "Спокійний" },
                            { value: "encouraging", label: "Підбадьорливий" },
                            { value: "direct", label: "Прямолінійний" },
                        ]}
                        className="rounded-xl shadow-sm"
                    />

                    {/* Гумор */}
                    <div className="flex items-center justify-between bg-[var(--neutral-bg)] px-4 py-3 rounded-xl shadow-sm">
                        <label htmlFor="humor" className="text-sm">
                            Дозволити гумор
                        </label>
                        <ToggleSwitch checked={humor} onChange={setHumor} />
                    </div>

                    {/* Нецензурна лексика */}
                    <div
                        className={`flex flex-wrap items-center justify-between gap-3 sm:gap-4 px-4 py-3 rounded-xl shadow-sm bg-[var(--neutral-bg)] ${
                            profileData?.age < 16 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <label
                            htmlFor="swearing"
                            className="text-sm leading-snug flex-1 min-w-[200px]"
                        >
                            Дозволити іноді використовувати нецензурну лексику
                        </label>

                        <div className="flex-shrink-0">
                            <ToggleSwitch
                                checked={swearing}
                                onChange={setSwearing}
                                disabled={profileData?.age < 16}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 🚀 Toast */}
            <Toast
                message={toastMessage}
                duration={3000}
                onClose={() => setToastMessage("")}
            />
        </section>
    );


}
