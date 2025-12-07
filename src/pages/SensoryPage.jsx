// src/pages/SensoryPage.jsx
import { Lightbulb } from "lucide-react";
import BackLink from "../components/BackLink";

export default function SensoryPage() {
  return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
          Сенсорне заспокоєння
        </h1>
        <p className="text-center italic mb-6 text-gray-700 dark:text-gray-300">
          Сенсорне заспокоєння — це метод стабілізації емоційного стану через залучення органів чуття.
        </p>

        {/* Вступний блок */}
        <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
          <p className="mb-2">
            Ці практики базуються на роботі з відчуттями — дотиком, запахами, звуками, температурою. Вони допомагають знизити фізіологічну напругу, покращити саморегуляцію та повернути відчуття безпеки.
          </p>
          <p>
            Часто застосовуються при емоційному перенавантаженні, тривожності, гіперзбудженні.
          </p>
        </div>

        {/* Теги */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Активація парасимпатичної нервової системи",
            "Зменшення надмірної стимуляції",
            "Створення відчуття комфорту і передбачуваності",
            "Підвищення тілесної усвідомленості",
            "Переключення уваги з внутрішніх переживань на зовнішні сигнали",
          ].map((tag, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Запахи */}
        <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
          <h3 className="font-semibold text-custom-blue dark:text-white">Запахи</h3>
          <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
            <li>Оберіть знайомий, приємний аромат (ефірна олія, чай, косметичний засіб)</li>
            <li>Зосередьтесь на запаху протягом 1–2 хвилин</li>
            <li>Спостерігайте за тілесною реакцією без оцінки</li>
          </ul>
          <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
            <Lightbulb size={16} className="mt-1" />
            Дослідження показують, що запахи напряму впливають на лімбічну систему, пов’язану з емоційною регуляцією.
          </p>
        </div>

        {/* Дотик */}
        <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
          <h3 className="font-semibold text-custom-blue dark:text-white">Дотик</h3>
          <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
            <li>Візьміть м’який або текстурований предмет (плед, одяг, тканина)</li>
            <li>Проведіть пальцями по поверхні</li>
            <li>Відзначайте температурні й тактильні характеристики</li>
          </ul>
          <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
            <Lightbulb size={16} className="mt-1" />
            Це може допомогти знизити фізіологічне збудження й заякорити у “тут і тепер”.
          </p>
        </div>

        {/* Звуки */}
        <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
          <h3 className="font-semibold text-custom-blue dark:text-white">Звуки</h3>
          <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
            <li>Увімкніть монотонний спокійний звук (дощ, білий шум, природні фони)</li>
            <li>Протягом 2–3 хвилин концентруйтесь лише на ньому</li>
            <li>За можливості — робіть це в спокійному середовищі без додаткових подразників</li>
          </ul>
        </div>

        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-6">
          Практики сенсорного заспокоєння можуть використовуватись як в індивідуальному режимі, так і як частина ширшої програми саморегуляції. Важливо обирати лише ті стимули, які не викликають неприємних реакцій.
        </p>
      </div>
    </div>
  );
}
