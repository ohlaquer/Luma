// src/pages/guide/AboutLumaGuide.jsx
import React from "react";
import BackLink from "../../components/BackLink";
import {
    Heart,
    Flower2,
    Sparkles,
    HandHelping,
    BookOpen,
    Brain,
    Eye,
    ShieldCheck,
    MessageCircleHeart,
    Ban,
} from "lucide-react";

export default function AboutLumaGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">

            <div className="max-w-3xl mx-auto">
                <BackLink to="/guide" text="Назад до довідника" />

                <h1 className="text-3xl font-bold mb-6">Про Luma</h1>

                <p className="opacity-80 mb-12">
                    Luma — це український емоційний простір для рефлексії, підтримки
                    та самопізнання. Створена як безпечний, м’який сервіс, який допомагає
                    людині зрозуміти свої переживання та відстежувати власні зміни
                    без тиску, осуду чи діагнозів.
                </p>
            </div>

            <section className="space-y-16 max-w-3xl mx-auto">

                {/* ================= Філософія ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Flower2 className="w-6 h-6" />
                        Філософія сервісу
                    </h2>

                    <p className="opacity-80 mb-4">
                        Luma базується на ідеї, що кожна людина має право на тихий,
                        теплий простір, де її досвід не знецінюють і не оцінюють.
                        Це місце, де можна чесно говорити з собою, відчути підтримку
                        і помітити зміни у внутрішньому стані.
                    </p>

                    <ul className="list-disc pl-6 opacity-80 space-y-2">
                        <li>
                            <strong>Емпатія, а не поради.</strong>
                            Luma не каже «роби так», а допомагає людині дійти
                            до власного рішення.
                        </li>

                        <li>
                            <strong>М’якість замість тиску.</strong>
                            Жодної критики чи оцінок — лише підтримка та турбота.
                        </li>

                        <li>
                            <strong>Безпека понад усе.</strong>
                            Шифрування, модерація й мінімальний збір даних —
                            головні пріоритети.
                        </li>

                        <li>
                            <strong>Людяність.</strong>
                            Рекомендації, фрази та метафори звучать природно,
                            тепло і по-людськи.
                        </li>
                    </ul>
                </div>

                {/* ================= Основні принципи ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Основні принципи Luma
                    </h2>

                    <div className="space-y-8">

                        {/* Емпатія */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                1. Емпатія та людський тон
                            </h3>
                            <p className="opacity-80">
                                Відповіді Luma базуються на підтримці, прийнятті і турботі —
                                без порівнянь, моралізаторства чи токсичного позитиву.
                            </p>
                        </div>

                        {/* Приватність */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                2. Конфіденційність та шифрування
                            </h3>
                            <p className="opacity-80">
                                Записи щоденника, чати й персональні дані зберігаються
                                в зашифрованому вигляді.
                                У Firebase не зберігається відкритий текст.
                            </p>
                        </div>

                        {/* Саморефлексія */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                3. Фокус на рефлексії
                            </h3>
                            <p className="opacity-80">
                                Luma не «лікує» і не дає інструкцій.
                                Вона задає м’які питання, які стимулюють людину подивитися всередину.
                            </p>
                        </div>

                        {/* Прозорість */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                4. Прозорість
                            </h3>
                            <p className="opacity-80">
                                Користувач завжди розуміє, як працює сервіс, що зберігається,
                                і які дії виконує Luma.
                            </p>
                        </div>

                        {/* Підтримка без тиску */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <HandHelping className="w-5 h-5" />
                                5. Підтримка без тиску
                            </h3>
                            <p className="opacity-80">
                                Luma ніколи не намагається «переїхати» людину порадами.
                                Вона поруч, а не «над».
                            </p>
                        </div>
                    </div>
                </div>
                {/* ================= Етичні обмеження ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6" />
                        Етичні обмеження Luma
                    </h2>

                    <p className="opacity-80 mb-6">
                        Luma створена не як терапевт і не як діагностичний інструмент —
                        це емоційний супутник, який діє в межах чітких етичних правил.
                        Вони гарантують, що взаємодія з Luma завжди залишається безпечною,
                        коректною та гуманною.
                    </p>

                    <div className="space-y-6">

                        <div>
                            <h3 className="text-xl font-semibold mb-2">1. Відсутність діагностики</h3>
                            <p className="opacity-80">
                                Luma ніколи не ставить діагнозів і не інтерпретує повідомлення
                                як ознаки «депресії», «панічного розладу» або іншого стану.
                                Усі формулювання — нейтральні, описові та підтримуючі.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">2. Жодних інструкцій небезпечної поведінки</h3>
                            <p className="opacity-80">
                                Якщо користувач пише про самопошкодження, Luma не надає порад,
                                не романтизує і не дає деталей — відповіді лише підтримуючі,
                                безпечні і з пропозицією звернутися за реальною допомогою.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">3. Нуль тиску та маніпуляцій</h3>
                            <p className="opacity-80">
                                Жодних фраз у стилі “ти маєш” або “зроби це негайно”.
                                Luma не контролює користувача і не намагається нав’язати рішення.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">4. Повага до особистих меж</h3>
                            <p className="opacity-80">
                                Якщо людина не хоче обговорювати тему — Luma її не витягує,
                                не тисне і не «копає глибше».
                                Користувач сам задає глибину розмови.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">5. Прозорість у намірах</h3>
                            <p className="opacity-80">
                                Кожна функція має очевидну мету.
                                У Luma немає прихованої монетизації, рекламних API,
                                прихованих метрик або профілювання користувача.
                            </p>
                        </div>

                    </div>
                </div>

                {/* ================= Місія ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Місія Luma
                    </h2>

                    <p className="opacity-80">
                        Luma створена для того, щоб надати кожному українцю доступний,
                        безпечний простір для емоційної підтримки, самопізнання
                        та внутрішньої рівноваги.
                    </p>

                    <ul className="list-disc pl-6 opacity-80 mt-4 space-y-2">
                        <li>підтримати людину у складні моменти;</li>
                        <li>допомогти розкласти думки по поличках;</li>
                        <li>дати м’який формат саморефлексії;</li>
                        <li>показати динаміку настрою та змін;</li>
                        <li>навчити слухати себе.</li>
                    </ul>
                </div>

                {/* ================= Що Luma НЕ робить ================= */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Ban className="w-6 h-6" />
                        Чого Luma НЕ робить
                    </h2>

                    <div className="space-y-4 opacity-80">

                        <p>
                            Для прозорості та етики важливо розуміти межі сервісу.
                            Ось що Luma принципово НЕ виконує:
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Не ставить діагнозів.</strong></li>
                            <li><strong>Не замінює психотерапевта.</strong></li>
                            <li><strong>Не дає медичних порад.</strong></li>
                            <li><strong>Не аналізує людину без згоди.</strong></li>
                            <li><strong>Не передає дані стороннім сервісам.</strong></li>
                            <li><strong>Не романтизує небезпечну поведінку.</strong></li>
                            <li><strong>Не тисне на користувача.</strong></li>
                        </ul>

                        <p className="mt-4">
                            Фокус Luma — це емоційна підтримка,
                            м’яка рефлексія і безпечний простір для думок.
                        </p>
                    </div>
                </div>

            </section>
        </div>
    );
}
