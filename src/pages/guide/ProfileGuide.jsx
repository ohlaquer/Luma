import React from "react";
import BackLink from "../../components/BackLink";

import {
    User,
    Mail,
    Sparkles,
    Key,
    FileDown,
    Trash2,
    ShieldCheck,
    Image as ImageIcon,
    Settings,
    Smile,
    Heart,
    MessageSquareHeart
} from "lucide-react";

export default function ProfileGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">

            <div className="max-w-3xl mx-auto">
                <BackLink to="/guide" text="Назад до довідника" />

                <h1 className="text-3xl font-bold mb-6">
                    Профіль та налаштування Luma
                </h1>

                <p className="opacity-80 mb-12">
                    Цей розділ пояснює дві важливі сторінки особистого кабінету:
                    <strong> профіль користувача</strong> та <strong>налаштування Luma</strong>.
                    Обидві сторінки допомагають персоналізувати твій досвід,
                    керувати даними та контролювати приватність.
                </p>
            </div>

            <section className="space-y-16 max-w-3xl mx-auto">

                {/* ======================== */}
                {/*     1. ПРОФІЛЬ ЮЗЕРА     */}
                {/* ======================== */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Сторінка профілю
                    </h2>

                    <p className="opacity-80 mb-6">
                        На сторінці профілю зберігається вся особиста інформація користувача.
                        Тут можна змінити аватар, імʼя, пошту, пароль або біо, а також керувати
                        даними та безпекою.
                    </p>

                    {/* ПІДРОЗДІЛИ */}
                    <div className="space-y-10">

                        {/* Аватар */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Аватар
                            </h3>

                            <p className="opacity-80">
                                Фото профілю можна завантажити або видалити.
                                Зображення зберігається у Firebase Storage.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                                <li>Завантаження нового аватара</li>
                                <li>Миттєве оновлення у профілі</li>
                                <li>Повне видалення аватара зі Storage</li>
                            </ul>
                        </div>

                        {/* Особисті дані */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Ім’я, пошта та біо
                            </h3>

                            <p className="opacity-80">
                                Можна змінити імʼя (псевдонім), електронну пошту
                                або короткий опис про себе.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                                <li>Зміна ім’я відображається у чатах</li>
                                <li>Для зміни пошти потрібне підтвердження пароля</li>
                                <li>Пошта потребує повторної верифікації</li>
                                <li>Біо зберігається в зашифрованому вигляді</li>
                            </ul>
                        </div>

                        {/* Паролі */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                Зміна паролю
                            </h3>

                            <p className="opacity-80">
                                Для зміни пароля користувач має ввести поточний пароль.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80">
                                <li>Повторна автентифікація перед зміною</li>
                                <li>Захист від несанкціонованих змін</li>
                            </ul>
                        </div>

                        {/* Експорт даних */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <FileDown className="w-5 h-5" />
                                Експорт даних
                            </h3>

                            <p className="opacity-80">
                                Доступна функція вивантаження всіх особистих даних у PDF:
                                записів щоденника, чатів, профілю.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80">
                                <li>Зашифровані записи розшифровуються перед експортом</li>
                                <li>PDF містить повну інформацію про акаунт</li>
                            </ul>
                        </div>

                        {/* Очистити дані */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Видалення даних
                            </h3>

                            <p className="opacity-80">
                                Користувач може повністю стерти записи щоденника,
                                чати, аватар та налаштування.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80">
                                <li>Повне очищення Firestore</li>
                                <li>Скидання налаштувань профілю</li>
                                <li>Автоматичне перенаправлення на головну</li>
                            </ul>
                        </div>

                        {/* Видалення акаунта */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Видалення акаунта
                            </h3>

                            <p className="opacity-80">
                                Для видалення акаунта потрібне підтвердження пароля.
                                Це захищає від випадкового або несанкціонованого доступу.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======================== */}
                {/*   2. НАЛАШТУВАННЯ LUMA   */}
                {/* ======================== */}

                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Налаштування Luma
                    </h2>

                    <p className="opacity-80 mb-6">
                        Тут зберігаються всі параметри персоналізації:
                        стиль звертання, рід, тон, гумор, лайка та інші особливості,
                        які впливають на те, як Luma з тобою спілкується.
                    </p>

                    <div className="space-y-10">

                        {/* Стать */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Стать Luma
                            </h3>

                            <p className="opacity-80">
                                Вибір того, як Luma називатиме тебе у відповідях.
                            </p>

                            <ul className="list-disc pl-6 mt-3 opacity-80">
                                <li>жіночий</li>
                                <li>чоловічий</li>
                                <li>нейтральний</li>
                            </ul>
                        </div>

                        {/* Стиль звертання */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <MessageSquareHeart className="w-5 h-5" />
                                Стиль звертання
                            </h3>

                            <p className="opacity-80">
                                Вибір між більш дружнім «ти» або нейтральнішим «ви».
                            </p>
                        </div>

                        {/* Тон відповідей */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Тон відповідей
                            </h3>

                            <ul className="list-disc pl-6 mt-3 opacity-80">
                                <li>спокійний</li>
                                <li>підбадьорливий</li>
                                <li>прямолінійний</li>
                            </ul>
                        </div>

                        {/* Гумор */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Smile className="w-5 h-5" />
                                Гумор
                            </h3>

                            <p className="opacity-80">
                                Luma може використовувати легкий гумор у відповідях,
                                якщо це комфортно користувачу.
                            </p>
                        </div>

                        {/* Лайка */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                Використання нецензурної лексики
                            </h3>

                            <p className="opacity-80">
                                Опція доступна лише для користувачів 16+.
                                Впливає на стиль відповіді — пряміший і більш людяний.
                            </p>
                        </div>

                    </div>
                </div>

            </section>
        </div>
    );
}
