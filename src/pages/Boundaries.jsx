import { Shield, HeartCrack, Brain, Lightbulb, Megaphone, Users, Briefcase } from "lucide-react";
import BackLink from "../components/BackLink";

export default function BoundariesPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
            <div className="max-w-2xl mx-auto px-4">
                <div className="mb-6 flex justify-center">
                    <BackLink />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
                    Свідомі межі та психологічний тиск
                </h1>

                <p className="text-center text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Межі — це не стіни, а двері, які ти контролюєш.
                    Свідомі межі допомагають не потрапляти під вплив психологічного тиску,
                    який, на жаль, часто маскується під “турботу”, “жарти” або “поради”.
                </p>

                <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
                    <p className="italic mb-2">
                        “Ти маєш право сказати «ні», навіть якщо інші цього не розуміють.”
                    </p>
                    <p className="font-semibold">
                        <em>Повага до себе — це не грубість. Це доросла відповідальність за свій емоційний простір.</em>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {[
                        "Захищає від емоційного виснаження",
                        "Знижує ризик маніпуляцій",
                        "Розвиває впевненість у спілкуванні",
                        "Формує внутрішній стрижень",
                        "Допомагає уникати токсичних стосунків",
                    ].map((tag, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
                        >
                            {tag}
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-semibold mb-4 text-center text-custom-blue dark:text-white">
                    Основні форми психологічного тиску
                </h2>

                {/* 🔹 СТРАХ, СТИГМА, ГАЗЛАЙТИНГ */}
                <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Brain size={18} /> Стигма та знецінення
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Стигма — це навішування ярликів і знецінення через стан, професію, стать або досвід.
                        Вона особливо поширена в Україні щодо психічного здоров’я: “в тебе просто лінь”, “не вигадуй депресію”.
                    </p>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>“Ти що, знов у психолога ходиш? Може, краще попрацюй?”</li>
                        <li>“У нас усі так живуть, не перебільшуй.”</li>
                    </ul>
                </div>

                {/* 🔹 БУЛІНГ / МОБІНГ */}
                <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Users size={18} /> Булінг і мобінг
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Булінг — це систематичне приниження або висміювання.
                        У дорослому середовищі він часто перетворюється на <strong>мобінг</strong> — цькування на роботі.
                    </p>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>“Без тебе проєкт би вже закінчили.”</li>
                        <li>“Ти надто емоційна для цієї роботи.”</li>
                        <li>“Та він не потягне, він слабак.”</li>
                    </ul>
                </div>

                {/* 🔹 БОСИНГ */}
                <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Briefcase size={18} /> Босинг
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Коли керівник тисне через статус, створює атмосферу страху або принижує — це босинг.
                        Часто маскується під “мотивацію” або “професійні вимоги”.
                    </p>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>“Якщо не подобається — двері знаєш.”</li>
                        <li>“Я тут головний, ти мовчи.”</li>
                        <li>“Не грай жертву, я просто хочу, щоб ти зростав.”</li>
                    </ul>
                </div>

                {/* 🔹 ГАЗЛАЙТИНГ */}
                <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Lightbulb size={18} /> Газлайтинг
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Газлайтинг — це коли тебе змушують сумніватись у власному сприйнятті.
                        Людина перекручує факти, заперечує очевидне або робить вигляд, що “нічого не було”.
                    </p>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>“Ти надто драматизуєш.”</li>
                        <li>“Я такого не казав, ти вигадуєш.”</li>
                        <li>“З тобою неможливо говорити — ти все перекручуєш.”</li>
                    </ul>
                </div>

                {/* 🔹 ЕМОЦІЙНИЙ ШАНТАЖ / ВІДЧУТТЯ ПРОВИНИ */}
                <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <HeartCrack size={18} /> Емоційний шантаж
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Це спроби керувати тобою через почуття провини, страх втратити підтримку або кохання.
                    </p>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>“Якщо ти мене любиш — зроби це.”</li>
                        <li>“Я так страждаю через тебе, невже тобі байдуже?”</li>
                        <li>“Після всього, що я для тебе зробив?”</li>
                    </ul>
                </div>

                {/* 🔹 ДОДАТКОВІ ФОРМИ */}
                <div className="space-y-2 p-4 rounded-xl border mb-10 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Megaphone size={18} /> Інші форми тиску, які варто знати
                    </h3>
                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                        <li>
                            <strong>Віктімблеймінг</strong> — звинувачення жертви (“сама винна, що тебе образили”).
                        </li>
                        <li>
                            <strong>Сайлент-трітмент</strong> — мовчазне покарання, ігнорування як спосіб контролю.
                        </li>
                        <li>
                            <strong>Love bombing</strong> — надмірна увага, подарунки, лестощі, щоб швидко викликати залежність.
                        </li>
                        <li>
                            <strong>Інформаційний тиск</strong> — перекручування фактів у медіа, групах, колективах.
                        </li>
                    </ul>
                </div>

                {/* 🔹 ЯК ЧИНИТИ ОПІР І ВІДНОВЛЮВАТИ МЕЖІ */}
                <div className="space-y-2 p-4 rounded-xl border mb-10 bg-blue-100/40 dark:bg-white/5 border-blue-200 dark:border-white/10">
                    <h3 className="font-semibold text-custom-blue dark:text-white flex items-center gap-2">
                        <Shield size={18} /> Як діяти, коли твої межі порушують
                    </h3>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Іноді ситуація тиску виникає раптово — і важко одразу зрозуміти, як реагувати.
                        Ти не зобов’язаний бути ідеально впевненим чи спокійним.
                        Важливо пам’ятати, що <strong>в тебе є право на паузу</strong>, на сумнів і на турботу про себе.
                    </p>

                    <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300 space-y-1">
                        <li>
                            <strong>1. Зупинись і зроби вдих.</strong> Іноді кілька секунд тиші допомагають побачити ситуацію ясніше. Це теж дія.
                        </li>
                        <li>
                            <strong>2. Дозволь собі назвати те, що відбувається.</strong>
                            Можеш сказати спокійно: “Мені неприємно, коли це звучить так” або “Я хочу пояснити, як я це сприймаю”.
                        </li>
                        <li>
                            <strong>3. Обери коротку, чесну відповідь.</strong>
                            Не потрібно виправдовуватись — фрази на кшталт “Я зараз не готовий це обговорювати” чи “Мені треба час подумати” — цілком достатньо.
                        </li>
                        <li>
                            <strong>4. Якщо відчуваєш тиск — вийди з контакту.</strong>
                            Це не поразка, а спосіб зберегти власну енергію. Можеш повернутись до розмови пізніше, коли відчуєш внутрішню рівновагу.
                        </li>
                        <li>
                            <strong>5. Після ситуації — подбай про себе.</strong>
                            Запиши, що сталося. Поговори з людиною, якій довіряєш. Або просто посиди кілька хвилин на самоті, дозволяючи тілу заспокоїтись.
                        </li>
                        <li>
                            <strong>6. Якщо це повторюється — шукай підтримку.</strong>
                            Є психологічні служби, волонтерські ініціативи та лінії довіри, які можуть вислухати без осуду.
                            Не потрібно справлятись наодинці.
                        </li>
                    </ul>

                    <div className="mt-4">
                        <h4 className="font-semibold text-custom-blue dark:text-white mb-2">💬 Приклади м’яких, але твердих відповідей:</h4>
                        <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300 space-y-1">
                            <li>“Мені некомфортно це обговорювати в такому тоні.”</li>
                            <li>“Я бачу, що це важливо для тебе, але зараз я не готовий це продовжувати.”</li>
                            <li>“Я не впевнений, що це справедливо по відношенню до мене.”</li>
                            <li>“Давай зробимо паузу і повернемось до цього пізніше.”</li>
                            <li>“Я поважаю твою думку, але моя інша — і це теж нормально.”</li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-custom-blue dark:text-white mb-2">⚙️ Коли ситуацію складно уникнути:</h4>
                        <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300 space-y-1">
                            <li>
                                <strong>Залишайся на фактах.</strong> Замість “Ти мене принижуєш” можна сказати “Після цієї розмови я відчуваю напругу — хочу зрозуміти чому”.
                            </li>
                            <li>
                                <strong>Фіксуй події, якщо це систематично.</strong>
                                Записи допомагають не загубитись у сумнівах і можуть бути опорою, якщо доведеться звертатись за допомогою.
                            </li>
                            <li>
                                <strong>Не знецінюй свої реакції.</strong>
                                Якщо тобі боляче, сумно або соромно — це не слабкість, а сигнал, що межі були порушені.
                            </li>
                            <li>
                                <strong>Пам’ятай:</strong> твоє “ні” може звучати тихо — але воно має силу.
                                Ти не мусиш доводити його гучністю, лише впевненістю.
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic mb-10">
                    Якщо ти впізнаєш себе або близьку людину в цих ситуаціях — це не слабкість.
                    Це перший крок до відновлення власних меж.
                </p>
            </div>
        </div>
    );
}
