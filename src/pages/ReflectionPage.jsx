// src/pages/ReflectionPage.jsx
import { Lightbulb, Flame, Send, BookText } from "lucide-react";
import BackLink from "../components/BackLink";
import { Link } from "react-router-dom";

export default function ReflectionPage() {
  return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-custom-blue dark:text-white">
          Запис і саморефлексія
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Чому важливо записувати думки?
        </p>

        <div className="bg-blue-50 dark:bg-white/5 p-4 rounded-xl text-center text-[15px] text-[#34495E] dark:text-gray-300 mb-6 border border-blue-100 dark:border-white/10">
          <p className="mb-2">
            Запис думок і емоцій допомагає краще усвідомити свій стан, зрозуміти пережите і побачити власні реакції.
          </p>
          <p className="font-semibold">
            <em>“Якщо хаос у голові — напиши.”</em>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Впорядковує думки",
            "Дає змогу прожити емоції",
            "Відстежується прогрес",
            "Дозволяє подивитися на ситуацію з боку",
            "Сприяє заспокоєнню",
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
          Письмовий потік думок (Free writing)
        </h2>

          <div className="space-y-2 p-4 rounded-xl border mb-6 bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10">
              <ul className="list-disc list-inside text-[#34495E] dark:text-gray-300">
                  <li>Візьми аркуш або відкрий нотатник (можна прямо тут у додатку)</li>
                  <li>Встанови таймер на 5–10 хв</li>
                  <li>Пиши все, що приходить у голову. Не зупиняйся. Не оцінюй. Не редагуй.</li>
              </ul>

              <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400">
                  <Lightbulb size={16} className="mt-1" />
                  Мета – “вивантажити” думки і звільнити простір для спокою.
              </p>

              <div className="flex justify-center">
                  <Link
                      to="/cabinet/journal"
                      className="flex items-center gap-2 mt-4 px-5 py-2 rounded-full shadow-sm transition-all
        bg-blue-100 text-blue-600 hover:bg-blue-200
        dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  >
                      <BookText size={18} /> Відкрити щоденник
                  </Link>
              </div>
          </div>

        <h3 className="text-lg font-semibold text-center mb-4 text-custom-blue dark:text-white">
          Запитання для рефлексії
        </h3>
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-4">
          Відповідай на них у будь-якому порядку. Коротко або розгорнуто – як хочеш:
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Що я зараз відчуваю?",
            "Чого мені хочеться, але я не дозволяю собі?",
            "Що було для мене важливим сьогодні?",
            "Чи є в мені щось, що я уникаю?",
          ].map((question, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full text-sm shadow text-center bg-white text-[#34495E] dark:bg-white/10 dark:text-white"
            >
              {question}
            </div>
          ))}
        </div>

          {/* 🔥 Спалити лист — опис практики */}
          <div className="space-y-2 p-4 rounded-xl border mb-6
     bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10
     text-[#34495E] dark:text-gray-300 transition-colors">

              <h3 className="font-semibold text-custom-blue dark:text-white">
                  Спалити лист
              </h3>

              <p>
                  Іноді є речі, які не хочеться зберігати. Вони більше не несуть сенсу — лише вагу.
                  Практика “спалити лист” — це спосіб попрощатись із тим, що тримало, і зробити це усвідомлено.
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                  Це не про вогонь, а про дозвіл собі відпустити. Якщо захочеш провести практику у реальному житті —
                  зроби це спокійно і безпечно.
              </p>

              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Напиши все, що хочеш відпустити — те, що болить або більше не потрібне.</li>
                  <li>Прочитай цей лист уголос або про себе. Визнай, що це було частиною тебе, але більше не визначає тебе.</li>
                  <li>Якщо вирішиш спалити — роби це лише на відкритому повітрі, на землі чи асфальті. Тримай поруч воду.</li>
                  <li>Не роби цього в приміщенні. Безпека важливіша за символ.</li>
                  <li>Як альтернатива — можеш просто порвати лист або закопати його. Сенс той самий: завершення.</li>
              </ul>

              <p className="text-sm italic text-gray-700 dark:text-gray-400">
                  Ти не мусиш нічого спалювати, щоб відпустити.
                  Іноді достатньо просто написати, подивитись — і відчути, що стало легше.
              </p>
          </div>




          {/* 📩 Відправити в нікуди — описова практика */}
          <div className="space-y-3 p-4 rounded-xl border mb-6
     bg-blue-50 dark:bg-white/5 border-blue-100 dark:border-white/10
     text-[#34495E] dark:text-gray-300 transition-colors">

              <h3 className="font-semibold text-custom-blue dark:text-white">
                  Відправити в нікуди
              </h3>

              <p>
                  Якщо тобі потрібно виговоритись, але ти не хочеш, щоб хтось це читав — напиши і «відправ у нікуди».
                  Текст зникне — або ти зробиш із ним щось інше. Головне — щоб дія була свідомою і безпечною.
              </p>

              <p className="flex items-start gap-2 text-sm italic text-gray-600 dark:text-gray-400/80">
                  <Send size={16} className="mt-1 text-custom-blue dark:text-blue-300" />
                  Безпечна, символічна практика для тих випадків, коли просто треба випустити пару.
              </p>

              {/* 📋 Що написати */}
              <div className="bg-white dark:bg-[#1b1f25] p-3 rounded-md border
       border-blue-100 dark:border-blue-900/40 text-gray-700 dark:text-gray-200 transition-colors">
                  <h4 className="font-medium mb-2 text-custom-blue dark:text-blue-200">
                      Що написати — короткий чекліст
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Опиши те, що тяжить (що сталося, що відчуваєш) — коротко і чесно.</li>
                      <li>Назви емоції: «Я відчуваю злість / сором / печаль / полегшення».</li>
                      <li>Додай одне речення-підсумок: «Це більше не визначає мене» або «Я хочу рухатися далі».</li>
                      <li>Напиши, якщо хочеш — кому НЕ призначено (наприклад: «Це не для тебе»).</li>
                  </ul>
              </div>

              {/* ✍️ Як підготувати */}
              <div className="bg-white dark:bg-[#1b1f25] p-3 rounded-md border
       border-blue-100 dark:border-blue-900/40 text-gray-700 dark:text-gray-200 transition-colors">
                  <h4 className="font-medium mb-2 text-custom-blue dark:text-blue-200">
                      Як підготувати лист?
                  </h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                      <li>Візьми аркуш і будь-який інструмент для письма — ручка відмінно підходить.</li>
                      <li>Напиши: будь-що, що хочеш вивільнити — не редагуй, не виправляй, просто пиши.</li>
                      <li>Підпиши (або не підписуй — вибір за тобою).</li>
                      <li>Поклади лист у конверт, якщо вирішиш його зберігати або відправляти; інакше — тримай у руках і вирішуй далі.</li>
                  </ol>
              </div>

              {/* 🕊 Варіанти завершення */}
              <div className="bg-white dark:bg-[#1b1f25] p-3 rounded-md border
       border-blue-100 dark:border-blue-900/40 text-gray-700 dark:text-gray-200 transition-colors">
                  <h4 className="font-medium mb-2 text-custom-blue dark:text-blue-200">
                      Варіанти безпечної «відправки» або завершення
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                      <li>
                          <strong className="text-gray-800 dark:text-gray-100">Зберегти як капсулу часу:</strong>{" "}
                          поклади в конверт, напиши дату (наприклад, через 6 місяців) і сховай. Потім вирішиш — відкривати чи ні.
                      </li>
                      <li>
                          <strong className="text-gray-800 dark:text-gray-100">Викинути / порвати / подрібнити:</strong>{" "}
                          фізично знищити лист (шредер або вручну порвати). Безпечніше й екологічніше — компостувати папір (якщо можеш).
                      </li>
                      <li>
                          <strong className="text-gray-800 dark:text-gray-100">Відправити собі в майбутнє:</strong>{" "}
                          надішли лист самому з написом «Відкрити через рік». Це часто допомагає відчути дистанцію.
                      </li>
                      <li>
                          <strong className="text-gray-800 dark:text-gray-100">Передати довіреній особі або терапевту:</strong>{" "}
                          якщо хочеш, щоб хтось прочитав для підтримки — передай особисто.
                      </li>
                  </ul>
              </div>

              {/* 💭 Фрази-підказки */}
              <div className="bg-white dark:bg-[#1b1f25] p-3 rounded-md border
       border-blue-100 dark:border-blue-900/40 text-gray-700 dark:text-gray-200 transition-colors">
                  <h4 className="font-medium mb-2 text-custom-blue dark:text-blue-200">
                      Кілька фраз-підказок, якщо не знаєш, з чого почати
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                      <li>«Я втомився(лась) від того, як це зі мною працює.»</li>
                      <li>«Мені боляче через те, що сталося, і я хочу це залишити в минулому.»</li>
                      <li>«Це був(-ла) важкий період — я роблю перший крок, щоб відпустити.»</li>
                      <li>«Це не для того, щоб когось звинуватити; це для того, щоб звільнити себе.»</li>
                  </ul>
              </div>

              <p className="text-sm italic text-gray-600 dark:text-gray-400/80">
                  Порада: обирай варіант, який не шкодить ні тобі, ні оточенню. Символіка може бути важливою, але безпека — завжди важливіша.
              </p>
          </div>



      </div>
    </div>
  );
}
