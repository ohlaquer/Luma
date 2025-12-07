import React from "react";
import BackLink from "../../components/BackLink";
import {
    ClipboardList,
    Scan,
    User,
    Sparkles,
    Compass,
    Target,
    CheckCircle,
    Fingerprint,
    MessageSquareHeart,
    ArrowRight,
    Info,
} from "lucide-react";

export default function OnboardingGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">

            <div className="max-w-3xl mx-auto">
                <BackLink to="/guide" text="Назад до довідника" />

                <h1 className="text-3xl font-bold mb-6">Онбординг та гайд-тур</h1>

                <p className="opacity-80 mb-12">
                    Після реєстрації користувач проходить два обов’язкових кроки:
                    <strong> анкету онбордингу</strong> та <strong>інтерактивний гайд-тур</strong>.
                    Обидва етапи допомагають Luma адаптувати досвід під людину
                    та пояснюють, як працює сайт.
                </p>
            </div>

            <section className="space-y-16 max-w-3xl mx-auto">

                {/* ========================================= */}
                {/*              1. АНКЕТА ОНБОРДИНГУ          */}
                {/* ========================================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6" />
                        Анкета онбордингу
                    </h2>

                    <p className="opacity-80 mb-6">
                        Це перший екран, який зʼявляється після реєстрації.
                        Він збирає базову інформацію, що потрібна для персоналізації
                        та безпеки. Анкета є <strong>обов’язковою</strong>.
                    </p>

                    <div className="space-y-10">

                        {/* Вік */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Fingerprint className="w-5 h-5" />
                                Вік
                            </h3>
                            <p className="opacity-80">
                                Використовується для:
                            </p>
                            <ul className="list-disc pl-6 mt-2 opacity-80 space-y-1">
                                <li>вімкнення/вимкнення нецензурної лексики;</li>
                                <li>налаштування тональності відповідей;</li>
                                <li>безпеки (контент-фільтри).</li>
                            </ul>
                        </div>

                        {/* Стать */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Стать
                            </h3>
                            <p className="opacity-80">
                                Luma <strong>НЕ</strong> використовує цю інформацію.
                            </p>
                        </div>

                        {/* Сфера діяльності */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Compass className="w-5 h-5" />
                                Сфера діяльності
                            </h3>

                            <p className="opacity-80">
                                Вводиться вручну і шифрується перед збереженням.
                            </p>

                            <p className="opacity-80 mt-2">
                                Luma <strong>НЕ</strong> використовує цю інформацію.
                            </p>
                        </div>

                        {/* Досвід терапії */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                Досвід психотерапії
                            </h3>

                            <p className="opacity-80">
                                Luma <strong>НЕ</strong> використовує цю інформацію.
                            </p>
                        </div>

                        {/* Збереження */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Збереження та перехід
                            </h3>
                            <p className="opacity-80">
                                Дані зберігаються у Firestore, більшість полів шифрується AES-256
                                на боці клієнта. Після цього:
                            </p>
                            <ul className="list-disc pl-6 mt-2 opacity-80">
                                <li>ставиться позначка <code>onboarded: true</code></li>
                                <li>користувача перекидає в особистий кабінет</li>
                                <li>автоматично вмикається наступний етап — гайд-тур</li>
                            </ul>
                        </div>

                    </div>
                </div>




                {/* ========================================= */}
                {/*                2. ГАЙД-ТУР                 */}
                {/* ========================================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Scan className="w-6 h-6" />
                        Гайд-тур сайтом
                    </h2>

                    <p className="opacity-80 mb-6">
                        Після заповнення анкети користувач проходить інтерактивний тур.
                        Він підсвічує ключові елементи інтерфейсу та пояснює,
                        де що знаходиться. Тур неможливо пропустити —
                        користувач має завершити всі кроки.
                    </p>

                    <div className="space-y-10">

                        {/* Головна */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                1. Головна сторінка
                            </h3>
                        </div>

                        {/* Ресурсний простір */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                2. Ресурсний простір
                            </h3>
                        </div>

                        {/* Щоденник */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                3. Щоденник
                            </h3>
                        </div>

                        {/* Чат */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <MessageSquareHeart className="w-5 h-5" />
                                4. Чат з Luma
                            </h3>

                        </div>

                        {/* Завершення */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Завершення онбордингу
                            </h3>

                            <p className="opacity-80">
                                Після останнього кроку ставиться позначка:
                            </p>

                            <ul className="list-disc pl-6 mt-2 opacity-80">
                                <li><code>guideCompleted: true</code></li>
                            </ul>

                            <p className="opacity-80 mt-2">
                                І користувач потрапляє в особистий кабінет,
                                де вже доступні всі функції сайту.
                            </p>
                        </div>

                    </div>
                </div>

            </section>
        </div>
    );
}
