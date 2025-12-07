import React from "react";
import BackLink from "../../components/BackLink";
import {
    ListChecks,
    FileCheck,
    HelpCircle,
    Sparkles,
    ClipboardList
} from "lucide-react";

export default function TestsGuide() {
    return (
        <div className="min-h-screen w-full px-6 py-12 bg-[var(--bg)] text-[var(--text)] transition-colors">

            {/* Верхній блок */}
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center mb-6">
                    <BackLink to="/guide" text="Назад до довідника" />
                </div>

                <h1 className="text-3xl font-bold mb-6">
                    Психологічні тести
                </h1>

                <p className="opacity-80 mb-10">
                    У цьому розділі зібрані психологічні тести, які допомагають
                    краще зрозуміти свій емоційний стан, реакції, риси особистості
                    або рівень напруги.
                    Тести призначені для саморефлексії — вони не є діагностичним інструментом.
                </p>
            </div>

            {/* Основний опис */}
            <section className="space-y-12 max-w-3xl mx-auto">

                {/* Структура сторінки */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Як влаштована сторінка тестів
                    </h3>

                    <p className="opacity-80">
                        На сторінці відображається каталог доступних тестів.
                        Кожна картка містить зображення та назву тесту.
                        При відкритті тесту користувачу показуються:
                    </p>

                    <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                        <li>короткий опис;</li>
                        <li>інструкція;</li>
                        <li>кнопка <strong>“Почати”</strong> для переходу до питань.</li>
                    </ul>
                </div>

                {/* Процес проходження */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <ListChecks className="w-5 h-5" />
                        Як проходиться тест
                    </h3>

                    <p className="opacity-80">
                        Усі тести проходять у стандартизованому інтерфейсі:
                    </p>

                    <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                        <li>користувач послідовно бачить питання;</li>
                        <li>кожне питання містить готові варіанти відповідей;</li>
                        <li>після вибору — автоматичний перехід до наступного питання;</li>
                        <li>після завершення — показується підсумок.</li>
                    </ul>

                    <p className="opacity-80 mt-3">
                        Дані відповідей не зберігаються — тест проходиться приватно,
                        і результат показується лише один раз на екрані.
                    </p>
                </div>

                {/* Опис всіх тестів */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Які тести доступні
                    </h3>

                    <p className="opacity-80">
                        Кожен тест виконує свою функцію і допомагає дослідити певну сферу.
                    </p>

                    <ul className="list-disc pl-6 mt-4 opacity-80 space-y-2">

                        <li><strong>Тест на психологічну гнучкість</strong> — оцінка психологічної гнучкості та уникання досвіду.</li>
                        <li><strong>Тест на рівень агресивності</strong> — вимірює адаптивність і реакції на стрес.</li>
                        <li><strong>Шкала тривожності Бека</strong> — визначає рівень тривожності.</li>
                        <li><strong>Шкала депресії Бека</strong> — оцінює ступінь депресивних проявів.</li>
                        <li><strong>Тест на емоційний інтелект</strong> — про розуміння та керування емоціями.</li>
                        <li><strong>Тест Айзенка на тип темпераменту</strong> — тип особистості (екстраверсія / інтроверсія / нейротизм).</li>
                        <li><strong>Психогеометричний тест</strong> — сприйняття кольору та емоційної напруги.</li>
                        <li><strong>Кольоровий тест</strong> — емоційний стан за вибором кольорів.</li>
                        <li><strong>Тест на емоційне вигорання</strong> — оцінка емоційного виснаження та вигорання.</li>
                        <li><strong>Портрет цінностей</strong> — про внутрішню мотивацію та орієнтацію на цілі.</li>
                        <li><strong>Тест на акцентуації характеру</strong> — п’ятифакторна модель особистості.</li>
                        <li><strong>Тест на прояви ПТСР</strong> — виявляє симптоми посттравматичного стресу.</li>
                        <li><strong>Тест самооцінки</strong> — рівень самооцінки.</li>
                        <li><strong>Тест на рівень тривожності</strong> — реактивна та особистісна тривожність.</li>
                        <li><strong>Тест на сприйняття стресу</strong> — оцінка загального рівня стресу.</li>
                    </ul>
                </div>

                {/* Пояснення результатів */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Як читати результати
                    </h3>

                    <p className="opacity-80">
                        Після завершення тесту користувач отримує короткий підсумок:
                    </p>

                    <ul className="list-disc pl-6 mt-3 opacity-80 space-y-1">
                        <li>оцінка або рівень;</li>
                        <li>коротке пояснення, що означає цей рівень;</li>
                        <li>іноді — невеликий коментар для розуміння контексту.</li>
                    </ul>

                    <p className="opacity-80 mt-3">
                        Результати не містять медичних висновків.
                        Це лише спосіб краще зрозуміти свій стан у даний момент.
                    </p>
                </div>

                {/* Приватність */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <FileCheck className="w-5 h-5" />
                        Приватність
                    </h3>

                    <p className="opacity-80">
                        Відповіді та результати тестів <strong>не зберігаються</strong>,
                        не передаються та не використовуються в аналітиці.
                    </p>

                    <p className="opacity-80 mt-1">
                        Користувач проходить тест повністю приватно.
                    </p>
                </div>

            </section>
        </div>
    );
}
