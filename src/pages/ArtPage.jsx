import { Palette, Brush, Lightbulb } from "lucide-react";
import BackLink from "../components/BackLink";

export default function ArtPage() {
  return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
          Арт-методики
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Коли емоції важко описати словами — дай їм форму, колір, рух.
          Арт-практики допоможуть відчути себе, вивільнити напруження та побачити внутрішній стан.
        </p>

        <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
          <p className="italic mb-2">
            Творчість — це не про “вміти малювати”, а про чесний діалог із собою.
          </p>
          <p className="font-semibold">
            <em>“Емоції можна вилити фарбами, навіть якщо не знаєш, що саме тебе турбує.”</em>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Заспокоює нервову систему",
            "Допомагає усвідомити почуття",
            "Знижує тривожність",
            "Повертає відчуття контролю",
            "Відкриває шлях до самовираження",
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
          Практики творчого самовираження
        </h2>

        {[
          {
            title: "Малювання мандали",
            steps: [
              "Обери коло на аркуші або онлайн-інструмент.",
              "Почни малювати з центру: лінії, символи, візерунки.",
              "Нехай твоя рука рухається інтуїтивно — без оцінки.",
              "Спостерігай за станом: що відчуваєш, які кольори обираєш?",
            ],
            duration: "10–20 хвилин у тиші або під спокійну музику.",
          },
          {
            title: "Вільне малювання (Free Drawing)",
            steps: [
              "Візьми будь-який аркуш і щось для малювання (олівець, маркер, фарби).",
              "Почни виводити лінії, плями, форми — без задуму, наче “виливаєш” емоцію.",
              "Не намагайся зробити “гарно” — просто дай емоціям форму.",
              "Якщо хочеш, напиши кілька слів або фраз, які виринають.",
            ],
            duration: "5–15 хвилин спонтанного вираження.",
          },
          {
            title: "Творчий колаж",
            steps: [
              "Знайди старі журнали, кольоровий папір, наліпки тощо.",
              "Виріж елементи, які відгукуються: образи, слова, кольори.",
              "Наклей на аркуш як захочеш — це твій “внутрішній світ”.",
              "Колаж можна залишити відкритим: повертатись і додавати.",
            ],
            duration: "15–30 хвилин у затишному просторі.",
          },
          {
            title: "Візуалізація емоції через колір і форму",
            steps: [
              "Заплющ очі, зосередься на тому, що відчуваєш.",
              "Уяви: який це колір? Яка форма? Рух? Текстура?",
              "Передай це на папері або в онлайн-інструменті.",
              "Не аналізуй, просто дозволь зʼявитися образу.",
            ],
            duration: "5–10 хвилин як медитативна вправа.",
          },
        ].map((practice, index) => (
          <div
            key={index}
            className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10"
          >
            <h3 className="font-semibold text-custom-blue dark:text-white">
              {practice.title}
            </h3>
            <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
              {practice.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-sm text-custom-blue dark:text-white">
              <Palette size={16} /> {practice.duration}
            </p>
            <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
              <Lightbulb size={16} className="mt-1" />
              Виконуй практику у спокійному середовищі. Можеш запалити свічку, поставити спокійну музику або просто посидіти в тиші після завершення.
            </p>
            <div className="flex justify-center">
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
