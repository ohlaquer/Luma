import { Repeat2, Lightbulb } from "lucide-react";
import BackLink from "../components/BackLink";

export default function GroundingPage() {
  const practices = [
    {
      title: "Температурне заземлення",
      steps: [
        "Потримай у руках щось холодне або гаряче (наприклад, крижаний пакет, чашку з теплим чаєм).",
        "Зосередься на відчуттях температури, як вона змінюється, як впливає на тіло.",
        "Опиши словами — \"тепло\", \"холод\", \"пульсує\", \"стискає\" тощо.",
      ],
      tip: "Температура — це простий сенсорний якір, який не викликає перевантаження.",
    },
    {
      title: "Почуй своє тіло",
      steps: [
        "Ляж або сядь зручно, закрий очі.",
        "Пройди увагою від голови до п’ят, відчуваючи кожну частину тіла.",
        "Зупиняйся на частинах, де є напруга або \"відсутність контакту\".",
        "Повторюй подумки: \"Я відчуваю...\", \"Це моя шия...\"",
      ],
      tip: "Це тілесне сканування — але в м’якій, заземлюючій версії. Не плутати з прогресивною релаксацією.",
    },
    {
      title: "Предмет сили (якір)",
      steps: [
        "Обери предмет, який асоціюється з безпекою (камінь, браслет, кулон).",
        "Тримай його в руках, відчуй його текстуру, вагу.",
        "Промовляй фразу-якір: \"Це мій якір. Я тут. Я в безпеці.\"",
      ],
      tip: "Практика створює постійний сенсорний зв’язок для самозаспокоєння.",
    },
  ];

  return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
          Grounding / Заземлення
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6 italic">
          Коли все "пливе" — найкраще відчути землю під ногами.
        </p>

        <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
          <p>
            <strong>Заземлення</strong> — це практика повернення до тілесного і сенсорного досвіду.
            Вона допомагає вийти з потоку тривожних думок і відчути реальність — через тіло, дотик, вагу, баланс.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Зменшує відчуття роз'єднаності й дереалізації",
            "Знижує інтенсивність паніки або дезорієнтації",
            "Допомагає “сповільнитись” і повернути відчуття контролю",
            "Відновлює контакт із тілом",
            "Повертає у “тут і тепер” через фізичні відчуття",
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
          Практики заземлення
        </h2>

        {practices.map((practice, i) => (
          <div
            key={i}
            className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10"
          >
            <h3 className="font-semibold text-custom-blue dark:text-white">
              {practice.title}
            </h3>
            <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
              {practice.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
            <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
              <Lightbulb size={16} className="mt-1" />
              {practice.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
