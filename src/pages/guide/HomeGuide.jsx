import React from "react";
import BackLink from "../../components/BackLink";
import { Type, Sparkles, Edit3, LayoutPanelLeft, Smile } from "lucide-react";

export default function HomeGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">

            {/* Верхній блок */}
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center mb-6">
                    <BackLink to="/guide" text="Назад до довідника" />
                </div>

                <h1 className="text-3xl font-bold mb-6">
                    Головна сторінка Luma
                </h1>

                <p className="opacity-80 mb-10">
                    Головна сторінка — це перше місце, куди потрапляє користувач після входу в Luma.
                    Вона складається з двох основних частин: привітального екрану з цитатами
                    та блоку аналізу емоційного стану.
                </p>
            </div>

            {/* Основний опис */}
            <section className="space-y-12 max-w-3xl mx-auto">

                {/* Привітальний блок */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Привітальний екран
                    </h3>
                    <p className="opacity-80">
                        Після відкриття Luma користувача зустрічає теплий екран із цитатами, що змінюються.
                        Це короткі фрази про прийняття, щирість та самоцінність.
                        Вони задають тон спокою й підтримки. Наприклад:
                    </p>
                    <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                        <li>“Справжня сила в тому, щоб просто бути собою.”</li>
                        <li>“У щирості немає слабкості.”</li>
                        <li>“Твої почуття мають значення.”</li>
                        <li>“Не потрібно бути ідеальним, щоб бути цінним.”</li>
                    </ul>
                    <p className="opacity-80 mt-3">
                        Під цитатами розташована кнопка <strong>“Почати розмову”</strong>,
                        яка відкриває форму для аналізу емоцій.
                    </p>
                </div>

                {/* Аналізатор емоцій */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Аналізатор емоцій
                    </h3>
                    <p className="opacity-80">
                        У цьому блоці користувач може описати свій поточний стан.
                        Поле вводу супроводжується запитанням:
                        <em> “Як Ви сьогодні почуваєтеся?”</em>
                        Після натискання кнопки <strong>“Аналізувати”</strong>,
                        текст надсилається на сервер, де Luma визначає емоційний настрій.
                    </p>
                </div>

                {/* Результат аналізу */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Smile className="w-5 h-5" />
                        Результат аналізу
                    </h3>
                    <p className="opacity-80">
                        Після аналізу користувач бачить короткий звіт:
                        emoji емоції, назву стану, коротке пояснення та пораду.
                        Luma не оцінює — вона лише допомагає зрозуміти власні почуття.
                    </p>
                </div>

                {/* Хедер і навігація */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <LayoutPanelLeft className="w-5 h-5" />
                        Хедер і навігація
                    </h3>
                    <p className="opacity-80">
                        У верхній частині розташовані основні елементи навігації:
                        логотип, меню, перемикач теми (світла / темна) та кнопки для переходу
                        до інших розділів: “Щоденник”, “Ресурси”, “Чат” тощо.
                    </p>
                </div>

                {/* Кнопки переходу */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Edit3 className="w-5 h-5" />
                        Основні кнопки переходу
                    </h3>
                    <p className="opacity-80">
                        З головної сторінки користувач може швидко перейти до будь-якого
                        інструменту Luma — емоційного щоденника, чату, тестів або ресурсного простору.
                        Це робиться через зручні кнопки у верхньому меню.
                    </p>
                </div>
            </section>
        </div>
    );
}
