import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { User } from "lucide-react";
import { verifyBeforeUpdateEmail, onAuthStateChanged } from "firebase/auth";
import Toast from "../components/Toast";
import { exportUserData } from "../utils/exportPdf";
import { encrypt, decrypt, decryptJSON } from "../utils/secure";
import { deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import {
    updateProfile,
    updatePassword,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendEmailVerification,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage({ onBack, onNameChange }) {

    const [user, setUser] = useState(() => auth.currentUser);
    const [name, setName] = useState(user?.displayName || "Моє ім’я");
    const [bio, setBio] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [loadingExport, setLoadingExport] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();

    const handleResend = async () => {
        if (!user) return;
        try {
            await sendEmailVerification(user);
            setToastMsg("📧 Лист підтвердження надіслано");
            setCooldown(30); // 30 сек. таймер
        } catch (err) {
            console.error("Помилка при відправці:", err);
            setToastMsg("❌ Не вдалося відправити лист");
        }
    };

// таймер
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    // 👇 слухаємо юзера
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u?.displayName) setName(u.displayName);
        });
        return () => unsub();
    }, []);

    // 👇 тягнемо біо
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "users", user.uid, "config", "profile"));
                if (snap.exists()) {
                    const data = snap.data();

                    const decryptedBio =
                        typeof data.bio === "string" ? decrypt(data.bio) : "";
                    const decryptedAge =
                        typeof data.age === "string" ? decrypt(data.age) : data.age || "";
                    const decryptedOccupation =
                        typeof data.occupation === "string" ? decrypt(data.occupation) : data.occupation || "";
                    const decryptedTherapy =
                        typeof data.therapyExperience === "string"
                            ? decrypt(data.therapyExperience)
                            : data.therapyExperience || "";

                    setProfileData({
                        ...data,
                        age: decryptedAge,
                        occupation: decryptedOccupation,
                        therapyExperience: decryptedTherapy,
                    });
                    setBio(decryptedBio);
                }
            } catch (err) {
                console.error("❌ Помилка при завантаженні профілю:", err);
                setToastMsg("❌ Немає доступу до профілю (увійди ще раз)");
            }
        };


        fetchProfile();
    }, [user?.uid]);


    const changeAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        try {
            const avatarRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(avatarRef, file);
            const url = await getDownloadURL(avatarRef);

            await updateProfile(user, { photoURL: url });
            await setDoc(
                doc(db, "users", user.uid, "config", "profile"),
                { bio: encryptedBio },
                { merge: true }
            );

            setToastMsg("🖼️ Аватар оновлено!");
        } catch (err) {
            console.error("Помилка при оновленні аватара:", err);
            setToastMsg("❌ Не вдалося змінити аватар");
        }
    };



    const removeAvatar = async () => {
        if (!user) return;

        try {
            // 🔥 1. Видаляємо файл у Storage
            const avatarRef = ref(storage, `avatars/${user.uid}`);
            await deleteObject(avatarRef).catch(() => {});

            // 🔥 2. Скидаємо фото у Firebase Auth
            await updateProfile(user, { photoURL: "" });

            // 🔥 3. Видаляємо photoURL із Firestore (не обов'язково, але чисто)
            await setDoc(
                doc(db, "users", user.uid, "config", "profile"),
                { photoURL: "" },
                { merge: true }
            );

            // 🔥 4. Локально оновлюємо інтерфейс
            setUser({ ...user, photoURL: "" });

            setToastMsg("🗑️ Аватар видалено");
        } catch (err) {
            console.error("❌ Помилка при видаленні аватара:", err);
            setToastMsg("❌ Не вдалося видалити аватар");
        }
    };


    const saveAll = async () => {
        if (!user) return;

        try {
            // зміна пошти
            if (newEmail.trim()) {
                if (!currentPassword.trim()) {
                    setToastMsg("❌ Введи поточний пароль для підтвердження зміни пошти");
                    return;
                }
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await verifyBeforeUpdateEmail(user, newEmail);
                setToastMsg("📧 На нову пошту відправлено лист підтвердження. Перевір вхідні!");
                setNewEmail("");
            }

            // зміна паролю
            if (newPassword.trim()) {
                if (!currentPassword.trim()) {
                    setToastMsg("❌ Введи поточний пароль для підтвердження зміни паролю");
                    return;
                }
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                setToastMsg("🔑 Пароль змінено");
                setNewPassword("");
            }


            // ім’я + опис
            await updateProfile(user, { displayName: name });

            // шифруємо тільки біо
            const encryptedBio = encrypt(bio);
            await setDoc(
                doc(db, "users", user.uid, "config", "profile"),
                { bio: encrypt(bio) },
                { merge: true }
            );


            if (onNameChange) onNameChange(name);


            setCurrentPassword("");
            setToastMsg("✅ Зміни збережено");
        } catch (err) {
            console.error("Помилка при збереженні:", err);
            setToastMsg(`❌ Помилка: ${err.message}`);
        }
    };

    const exportData = async () => {
        if (!user) return;
        try {
            setLoadingExport(true);


            // щоденник
            const journalsSnap = await getDocs(collection(db, "users", user.uid, "journalEntries"));
            const journalData = journalsSnap.docs.map((d) => {
                const data = d.data();

                // 🔓 розшифровуємо зображення
                let images = [];

                try {
                    let decrypted = decrypt(data.images);
                    // якщо результат досі виглядає як AES — розшифруй ще раз
                    if (decrypted.startsWith("U2FsdGVk")) {
                        decrypted = decrypt(decrypted);
                    }

                    if (decrypted.startsWith("[")) {
                        images = JSON.parse(decrypted);
                    } else if (decrypted.includes("http")) {
                        images = decrypted.split(/[\s,]+/).filter(x => x.startsWith("http"));
                    } else {
                        images = [];
                    }


                } catch (err) {
                    console.warn("❌ Помилка при розшифруванні images:", err);
                }




                if (typeof data.images === "string") {
                    try {
                        const dec = decrypt(data.images);

                    } catch (err) {
                        console.warn("⚠️ decrypt failed:", err);
                    }
                }

                return {
                    id: d.id,
                    ...data,
                    title: decrypt(data.title),
                    html: decrypt(data.html),
                    plain: decrypt(data.plain),
                    moodLabel: decrypt(data.moodLabel),
                    moodMeta:
                        typeof data.moodMeta === "string"
                            ? decryptJSON(data.moodMeta)
                            : data.moodMeta || {},
                    images, // 👈 тепер це масив
                };
            });



            // чати (не критично, просто залишимо)
            const chatsSnap = await getDocs(collection(db, "users", user.uid, "chats"));
            const chatData = chatsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

            await exportUserData({
                profile: {
                    name: user.displayName,
                    email: user.email,
                    bio: bio || "",
                    photoURL: user.photoURL || "",
                },
                journal: journalData,
                chats: chatData,
                profileData: profileData || {}, // 👈 захист
            });


        } catch (err) {
            console.error("❌ Помилка при експорті даних:", err);
            setToastMsg(`❌ Помилка при експорті: ${err.message || "невідомо"}`);
        } finally {
            setLoadingExport(false);
        }
    };


    const clearData = async () => {
        if (!user) return;

        try {
            // 🗑️ видаляємо записи щоденника
            const journals = await getDocs(collection(db, "users", user.uid, "journalEntries"));
            for (const d of journals.docs) {
                await deleteDoc(d.ref);
            }

            // 🗑️ видаляємо чати і їхні повідомлення
            const chats = await getDocs(collection(db, "users", user.uid, "chats"));
            for (const chat of chats.docs) {
                const messages = await getDocs(collection(db, "users", user.uid, "chats", chat.id, "messages"));
                for (const m of messages.docs) {
                    await deleteDoc(m.ref);
                }
                await deleteDoc(chat.ref);
            }

            // 🗑️ скидаємо профіль
            await setDoc(doc(db, "users", user.uid), {
                bio: "",
                photoURL: ""
            }, { merge: true });

            await updateProfile(user, {
                displayName: "друже",
                photoURL: ""
            });

            // 🗑️ пробуємо стерти файл у Storage
            try {
                const avatarRef = ref(storage, `avatars/${user.uid}`);
                await deleteObject(avatarRef);
            } catch (err) {
                console.warn("Не вдалося видалити аватар:", err);
            }
            //Скидаємо налаштування Luma (settings)
            await setDoc(
                doc(db, "users", user.uid, "config", "settings"),
                {
                    gender: "neutral",
                    formality: "ви",
                    tone: "calm",
                    humor: false,
                    swearing: false,
                    updatedAt: new Date()
                },
                { merge: true }
            );

            // Скидаємо онбординг-профіль (profile), але ЗБЕРІГАЄМО ВІК
            await setDoc(
                doc(db, "users", user.uid, "config", "profile"),
                {
                    // вік НЕ чіпаємо
                    gender: null,
                    occupation: null,
                    therapyExperience: null,
                    onboardingCompleted: false
                },
                { merge: true }
            );


            setToastMsg("Всі дані очищено, ім’я скинуто на 'друже'");
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

        } catch (err) {
            console.error("Помилка при очищенні даних:", err);
            setToastMsg("Не вдалося очистити всі дані");
        }
    };

    const removeAccount = async () => {
        if (!user) return;

        if (!currentPassword.trim()) {
            setToastMsg("Введіть пароль для підтвердження видалення акаунта");
            return;
        }

        try {
            // 🔑 створюємо credential і перевіряємо пароль
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // 🗑️ тепер можна видаляти
            await deleteUser(user);

            setToastMsg("Акаунт видалено");
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (err) {
            console.error("Помилка при видаленні акаунта:", err);
            setToastMsg("Неправильний пароль або помилка при видаленні акаунта");
        }
    };
    const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);


    return (
        <section
            className="mx-auto rounded-3xl
  bg-[var(--card-bg)] text-[var(--text)]
  w-full max-w-[650px] min-h-[678px] p-6 sm:p-8 space-y-10"
        >


        {/* === Верхній рядок === */}
            <div className="flex items-center justify-between mb-2 sm:mb-4">
                <button
                    onClick={() => navigate(-1)} // 👈 повертає на попередню сторінку
                    className="px-4 py-2 rounded-xl text-sm bg-[var(--neutral-bg)] text-[var(--text)]
    hover:bg-[var(--highlight-bg)] transition shadow-sm"
                >
                    Назад
                </button>


                <button
                    onClick={saveAll}
                    className="px-4 py-2 rounded-xl text-sm bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
                >
                    Зберегти
                </button>
            </div>

            {/* Аватар + інформація */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-6 sm:gap-10 text-center sm:text-left">

                {/* Аватар */}
                <div className="flex-shrink-0 flex justify-center sm:justify-start w-full sm:w-auto">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-[var(--highlight-bg)]">
                            <User size={40} className="text-[var(--text)] opacity-70" />
                        </div>
                    )}
                </div>

                {/* Ім’я, пошта, кнопка */}
                <div className="flex flex-col justify-center space-y-2 sm:-ml-2 text-left">
                    <p className="font-semibold text-lg">{name}</p>
                    <p className="text-sm opacity-70">{user?.email}</p>

                    {!user?.emailVerified && (
                        <div className="flex items-center justify-start gap-2">
            <span
                className="w-2.5 h-2.5 bg-[#E56A6A] rounded-full inline-block"
                title="Пошта не підтверджена"
            ></span>

                            <button
                                onClick={handleResend}
                                disabled={cooldown > 0}
                                className="text-xs text-blue-500 hover:underline disabled:opacity-50"
                            >
                                {cooldown > 0
                                    ? `Надіслати повторно (${cooldown})`
                                    : "Надіслати повторно"}
                            </button>
                        </div>
                    )}

                    <label className="text-sm text-blue-500 hover:underline mt-1 cursor-pointer inline-block">
                        Змінити аватар
                        <input
                            type="file"
                            accept="image/*"
                            onChange={changeAvatar}
                            className="hidden"
                        />
                    </label>

                    {/* ВИПРАВЛЕНО */}
                    <label
                        onClick={removeAvatar}
                        className="text-sm text-[#E56A6A] hover:underline mt-1 cursor-pointer inline-block"
                    >
                        Видалити аватар
                    </label>

                </div>


                {/* Дані з онбордингу */}
                {profileData && (
                    <div className="flex flex-col justify-center text-sm opacity-80 sm:pl-2 mt-4 sm:mt-0">
                        <p>Вік: {profileData.age || "—"}</p>
                        <p>Стать: {profileData.gender || "—"}</p>
                        <p>Сфера діяльності: {profileData.occupation || "—"}</p>
                        <p>Досвід терапії: {profileData.therapyExperience === "yes" ? "так" : "ні"}</p>
                    </div>
                )}
            </div>



            {/* === Поля === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ім’я */}
                <div>
                    <label className="block text-sm mb-1 text-[var(--muted-text)]">Псевдонім / Ім’я</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
          placeholder:text-[var(--muted-text)] border border-[var(--highlight-border)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          outline-none transition shadow-sm"
                    />
                </div>

                {/* Нова пошта */}
                <div>
                    <label className="block text-sm mb-1 text-[var(--muted-text)]">Нова пошта</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
          placeholder:text-[var(--muted-text)] border border-[var(--highlight-border)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          outline-none transition shadow-sm"
                    />
                </div>

                {/* Поточний пароль */}
                <div>
                    <label className="block text-sm mb-1 text-[var(--muted-text)]">Поточний пароль</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
          placeholder:text-[var(--muted-text)] border border-[var(--highlight-border)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          outline-none transition shadow-sm"
                    />
                </div>

                {/* Новий пароль */}
                <div>
                    <label className="block text-sm mb-1 text-[var(--muted-text)]">Новий пароль</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
          placeholder:text-[var(--muted-text)] border border-[var(--highlight-border)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          outline-none transition shadow-sm"
                    />
                </div>

                {/* Короткий опис */}
                <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-[var(--muted-text)]">Короткий опис</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Напиши трохи про себе..."
                        className="w-full h-28 p-4 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
          placeholder:text-[var(--muted-text)] border border-[var(--highlight-border)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          outline-none transition shadow-sm resize-none"
                    />
                </div>
            </div>

            {/* === Кнопки дій === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <button
                    onClick={exportData}
                    disabled={loadingExport}
                    className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm
        transition-all duration-200
        ${
                        loadingExport
                            ? "bg-[var(--neutral-bg)] text-[var(--muted-text)] cursor-not-allowed"
                            : "bg-[var(--neutral-bg)] text-[var(--text)] hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"
                    }`}
                >
                    {loadingExport && (
                        <svg
                            className="animate-spin h-5 w-5 text-[var(--muted-text)]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    )}
                    {loadingExport ? "Генерується..." : "Запросити всі дані"}
                </button>

                <button
                    onClick={clearData}
                    className="px-4 py-2.5 rounded-xl bg-[var(--neutral-bg)] text-[var(--text)]
        hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]
        shadow-sm transition"
                >
                    Видалити всі дані
                </button>

                <button
                    onClick={() => setShowDeletePopup(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#E56A6A] text-white hover:bg-[#D95C5C]
             shadow-sm md:col-span-2 transition-colors duration-200"
                >
                    Видалити акаунт
                </button>

            </div>

            {/* === Toast === */}
            {toastMsg && (
                <div className="mt-4 flex justify-center">
                    <Toast message={toastMsg} onClose={() => setToastMsg("")} />
                </div>
            )}

            {/* === Модалка підтвердження === */}
            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-white dark:bg-[var(--card-bg)] p-6 rounded-2xl shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Підтвердження</h2>
                        <p className="text-sm mb-3">Введи пароль, щоб видалити акаунт:</p>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-2xl border mb-4"
                            placeholder="Пароль"
                        />
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={() => setShowDeletePopup(false)}
                                className="px-4 py-2 rounded-2xl bg-gray-300 dark:bg-gray-700"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const credential = EmailAuthProvider.credential(user.email, deletePassword);
                                        await reauthenticateWithCredential(user, credential);
                                        await deleteUser(user);
                                    } catch (err) {
                                        console.error("❌ Помилка:", err.code, err.message);
                                        setToastMsg("Невірний пароль або помилка при видаленні акаунта");
                                    }
                                }}
                                className="px-4 py-2 rounded-2xl bg-red-500 text-white"
                            >
                                Підтвердити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );

}
