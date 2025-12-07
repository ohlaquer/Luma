// src/pages/guide/SecurityGuide.jsx
import React from "react";
import BackLink from "../../components/BackLink";
import {
    Shield,
    Lock,
    Database,
    EyeOff,
    AlertTriangle,
    MessageCircleWarning,
    FileDown,
    KeyRound,
} from "lucide-react";

export default function SecurityGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">
            <div className="max-w-3xl mx-auto">
                <BackLink to="/guide" text="Назад до довідника" />

                <h1 className="text-3xl font-bold mb-6">
                    Безпека, приватність та модерація
                </h1>

                <p className="opacity-80 mb-12">
                    Luma створена як безпечний простір для чутливих тем.
                    На цій сторінці зібрано пояснення, як працює приватність,
                    шифрування, збереження даних та модерація контенту.
                </p>
            </div>

            <section className="space-y-16 max-w-3xl mx-auto">

                {/* ================= Приватність ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Приватність та філософія безпеки
                    </h2>

                    <p className="opacity-80 mb-4">
                        Luma не створена для реклами, трекінгу або продажу даних.
                        Вона існує для того, щоб дати людині місце виговоритися
                        та відстежувати власний стан у безпечному середовищі.
                    </p>

                    <ul className="list-disc pl-6 opacity-80 space-y-2">
                        <li>
                            <strong>Жодної реклами.</strong> Дані не використовуються для таргетингу
                            або стороннього маркетингу.
                        </li>
                        <li>
                            <strong>Мінімум доступів.</strong> Додаток працює лише з тими сервісами,
                            які потрібні для функціонування (Firebase, власний сервер Luma).
                        </li>
                        <li>
                            <strong>Контроль на боці користувача.</strong> У будь-який момент можна
                            експортувати, очистити або видалити свій акаунт.
                        </li>
                    </ul>
                </div>

                {/* ================= Шифрування ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Lock className="w-6 h-6" />
                        Шифрування даних
                    </h2>

                    <p className="opacity-80 mb-4">
                        Найчутливіші дані шифруються <strong>на боці браузера</strong> перед тим,
                        як потрапити до бази. У Firebase зберігається лише зашифрований текст.
                    </p>

                    <div className="space-y-6">

                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <KeyRound className="w-5 h-5" />
                                Що шифрується
                            </h3>
                            <ul className="list-disc pl-6 opacity-80 space-y-1">
                                <li>записи щоденника (заголовок, текст, емоційні мітки);</li>
                                <li>повідомлення в чаті з Luma;</li>
                                <li>частина профільних полів (біо, сфера діяльності тощо);</li>
                                <li>додаткові «спогади» в системі пам’яті Luma.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                Як це виглядає в базі
                            </h3>
                            <p className="opacity-80">
                                У Firestore зберігаються довгі зашифровані рядки замість
                                реального тексту. Без ключа розшифрування вони не мають сенсу.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <EyeOff className="w-5 h-5" />
                                Обмеження доступу
                            </h3>
                            <p className="opacity-80">
                                На сервер Luma надсилається тільки той текст, який потрібен
                                для генерації відповіді або аналізу (чат, аналіз щоденника),
                                і лише в момент запиту. Решта часу дані лежать зашифрованими
                                у базі.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= Збереження чутливих даних ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Database className="w-6 h-6" />
                        Збереження чутливих даних
                    </h2>

                    <p className="opacity-80 mb-4">
                        Luma збирає тільки ті дані, які потрібні для роботи конкретних функцій:
                        щоденника, тестів, чату, онбордингу та персоналізації.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Які дані зберігаються
                            </h3>
                            <ul className="list-disc pl-6 opacity-80 space-y-1">
                                <li>акаунт (ім’я, пошта, аватар);</li>
                                <li>анкета онбордингу (вік, стать, сфера діяльності, досвід терапії);</li>
                                <li>записи щоденника (зашифровані);</li>
                                <li>чати з Luma (зашифровані);</li>
                                <li>налаштування тону, гумору, форми звертання;</li>
                                <li>дані для PDF-експорту (формуються тільки на запит).</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Експорт та видалення
                            </h3>
                            <ul className="list-disc pl-6 opacity-80 space-y-1">
                                <li>
                                    <strong>Експорт даних.</strong> Користувач може згенерувати PDF
                                    з основною інформацією профілю, щоденником та чатами.
                                </li>
                                <li>
                                    <strong>Очищення даних.</strong> Є окрема кнопка, що видаляє всі записи
                                    щоденника, чати, аватар та частину налаштувань.
                                </li>
                                <li>
                                    <strong>Видалення акаунта.</strong> Вимагає підтвердження пароля і
                                    повністю стирає користувача з Firebase Auth.
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Що не зберігається
                            </h3>
                            <p className="opacity-80">
                                Додаток не зберігає технічні логи у привʼязці до конкретного користувача
                                для аналітики настрою або побудови профілю «для реклами».
                                Дані використовуються тільки в межах функцій Luma.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= Модерація ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <MessageCircleWarning className="w-6 h-6" />
                        Модерація та небезпечний контент
                    </h2>

                    <p className="opacity-80 mb-4">
                        Перед тим, як Luma відповідає на повідомлення, текст проходить
                        через окремий модераційний шар. Це потрібно, щоб захистити
                        користувача від небезпечних сценаріїв та некоректних відповідей.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Що перевіряється
                            </h3>
                            <ul className="list-disc pl-6 opacity-80 space-y-1">
                                <li>прямі фрази про самопошкодження чи суїцид;</li>
                                <li>опис тяжкого насильства або травматичних подій;</li>
                                <li>контент, що може бути небезпечним для інших.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Як реагує Luma
                            </h3>
                            <p className="opacity-80">
                                Якщо модерація вважає повідомлення ризиковим:
                            </p>
                            <ul className="list-disc pl-6 opacity-80 mt-2 space-y-1">
                                <li>Luma не продовжує звичайний діалог;</li>
                                <li>надсилає м’яку, підтримуючу відповідь без тригерних деталей;</li>
                                <li>пропонує звернутися до реальної допомоги та сторінки підтримки;</li>
                                <li>не дає інструкцій і не романтизує небезпечну поведінку.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Межі відповідальності
                            </h3>
                            <p className="opacity-80">
                                Luma не є психотерапевтом, лікарем або кризовою службою.
                                Вона не ставить діагнозів, не замінює медичну чи психологічну допомогу
                                та завжди рекомендує звертатися до фахівців у критичних ситуаціях.
                            </p>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}
