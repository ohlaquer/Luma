import { Lightbulb, Repeat2 } from "lucide-react";
import BackLink from "../components/BackLink";

export default function CognitivePage() {
  const practices = [
    {
      title: "Назви 5 речей",
      list: [
        "Озирнись навколо і назви 5 речей, які бачиш",
        "Назви 4 речі, які можеш відчути (дотиком)",
        "Назви 3 речі, які чуєш",
        "Назви 2 речі, які можеш понюхати",
        "Назви 1 річ, яку можеш скуштувати або відчути у роті",
      ],
      note: "Техніка заземлення через 5 органів чуття",
      tip: "Дуже ефективно при паніці, тривозі, сильній дезорієнтації.",
    },
    {
      title: "Словесне сканування",
      list: [
        "Опиши словами, що бачиш прямо зараз",
        "Дай назву кольорам, формам, текстурам",
        "Опиши звуки навколо — навіть дуже тихі",
      ],
      note: "Допомагає вийти з нав'язливого внутрішнього діалогу",
      tip: "Особливо корисно при надмірному розумовому напруженні.",
    },
    {
      title: "3 об’єкти фокусування",
      list: [
        "Оберіть 3 речі — наприклад, чашку, руку, лампу",
        "Зосереджуйтесь на кожному об'єкті по 20–30 сек",
        "Фіксуйте увагу на деталях: колір, форма, відчуття",
      ],
      note: "Формує навичку усвідомленої уваги",
      tip: "Практика допомагає зменшити розумову “кашу” та перенавантаження.",
    },
  ];

  return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
          Когнітивна стабілізація
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Коли думки розбігаються, а увага "стрибає" — важливо м’яко повернути себе в опорну точку.
        </p>

        <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
          <p className="italic mb-2">
            Когнітивна стабілізація — це як ментальна опора. Вона допомагає уповільнитись і відновити ясність мислення.
          </p>
          <p className="font-semibold">
            <em>“Твої думки — не ти. Але ти можеш ними керувати.”</em>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Знижує нав'язливі думки",
            "Сприяє концентрації",
            "Відновлює внутрішню рівновагу",
            "Зменшує емоційний шум",
            "Повертає в момент тут і тепер",
          ].map((tag, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
            >
              {tag}
            </div>
          ))}
        </div>

        {practices.map((practice, i) => (
          <div
            key={i}
            className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10"
          >
            <h3 className="font-semibold text-custom-blue dark:text-white">
              {practice.title}
            </h3>
            <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
              {practice.list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-sm text-custom-blue dark:text-white">
              <Repeat2 size={16} /> {practice.note}
            </p>
            <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
              <Lightbulb size={16} className="mt-1" /> {practice.tip}
            </p>
          </div>
        ))}

        <p className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">
          Практики когнітивної стабілізації не потребують спеціальних умов. Їх можна використовувати будь-де — в транспорті, у черзі, вночі в ліжку.
        </p>
      </div>
    </div>
  );
}
