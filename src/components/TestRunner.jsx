// 📁 src/components/TestRunner.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import tests from "../tests";
import BackLink from "./BackLink";
import OrderingQuestion from "./OrderingQuestion";

export default function TestRunner() {
  const { id } = useParams();
  const test = tests[id];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

    // автозаповнення для ordering у люшера/делінґер
    useEffect(() => {
        if (!["luscher", "geometric-delinger"].includes(test.id)) return;
        if (!question || question.type !== "ordering") return;
        if (answers[current] !== undefined) return; // вже є відповідь — не чіпаємо

        const toVal = (x) => (typeof x === "string" ? x : x?.value);
        const initialOrder = (question.options || []).map(toVal);

        // пишемо "відповідь за замовчуванням" — поточний (відображений) порядок
        setAnswers((prev) => {
            const copy = [...prev];
            copy[current] = initialOrder;
            return copy;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, test.id]); // залежності без answers, щоб не зациклити

  if (!test || !test.questions || !Array.isArray(test.questions)) {
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Помилка: тест не знайдено або має некоректну структуру.
      </div>
    );
  }

  const handleSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current + 1 < test.questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const score = answers.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    const result = test.interpret ? test.interpret(answers) : { message: `Результат: ${score}` };


    if (finished) {
        const renderResult = () => {
            if (!result) return "Немає результату";

            if (result.error) {
                return <span className="text-red-500">{result.error}</span>;
            }

            if (result.scales) {
                // Перетворюємо в масив і сортуємо за балами ↓
                const sortedScales = Object.values(result.scales).sort(
                    (a, b) => b.score - a.score
                );

                // Знаходимо акцентуйовані (>12)
                const accentuated = sortedScales.filter((s) => s.accentuated);

                return (
                    <div className="space-y-4 text-left">
                        {accentuated.length > 0 && (
                            <div className="p-3 rounded-lg bg-[var(--surface-2)]">
                                <strong>Найбільш виражені риси:</strong>{" "}
                                {accentuated.map((s) => s.title).join(", ")}
                            </div>
                        )}

                        <div className="space-y-2">
                            {sortedScales.map((scale, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 rounded-lg bg-[var(--surface-1)]"
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[var(--text)] dark:text-gray-100">
                                                {scale.title}
                                            </span>
                                            {scale.description && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {scale.description}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-semibold text-[var(--text)] dark:text-gray-200 ml-3">
                                                     {scale.score}
                                                </span>
                                    </div>


                                </div>
                            ))}
                        </div>

                        {result.note && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 whitespace-pre-line">
                                {result.note}
                            </p>

                        )}

                    </div>
                );
            }
            if (result.table && result.analysis) {
                // варіант Люшера (колір + 2 проходи)
                if (result.table[0]?.color) {
                    return (
                        <div className="space-y-6">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                <tr className="bg-[var(--surface-2)]">
                                    <th className="p-2 border">Колір</th>
                                    <th className="p-2 border">1-й прохід</th>
                                    <th className="p-2 border">2-й прохід</th>
                                </tr>
                                </thead>
                                <tbody>
                                {result.table.map((row, i) => (
                                    <tr key={i} className="text-center">
                                        <td className="p-2 border">{row.color}</td>
                                        <td className="p-2 border">{row.first}</td>
                                        <td className="p-2 border">{row.second}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {result.analysis.length > 0 && (
                                <ol className="list-decimal list-inside space-y-1 text-left text-[var(--text)]">
                                    {result.analysis.map((line, i) => (
                                        <li key={i} className="pl-1">{line}</li>
                                    ))}
                                </ol>
                            )}

                            {result.note && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                                    {result.note}
                                </p>
                            )}
                        </div>
                    );
                }

                // варіант Деллінгер (фігура + опис)
                if (result.table[0]?.figure) {
                    return (
                        <div className="space-y-6">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                <tr className="bg-[var(--surface-2)]">
                                    <th className="p-2 border">Позиція</th>
                                    <th className="p-2 border">Фігура</th>
                                    <th className="p-2 border">Опис</th>
                                </tr>
                                </thead>
                                <tbody>
                                {result.table.map((row, i) => (
                                    <tr key={i} className="text-center">
                                        <td className="p-2 border">{row.position}</td>
                                        <td className="p-2 border">{row.figure}</td>
                                        <td className="p-2 border text-left">{row.description}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {result.analysis?.length > 0 && (
                                <ol className="list-decimal list-inside space-y-1 text-left text-[var(--text)]">
                                    {result.analysis.map((line, i) => (
                                        <li key={i} className="pl-1">{line}</li>
                                    ))}
                                </ol>
                            )}

                            {result.note && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 whitespace-pre-line">
                                    {result.note}
                                </p>
                            )}

                        </div>
                    );
                }
            }



            if (typeof result === "string") {
                return result;
            }

            return (
                <pre className="text-left whitespace-pre-wrap text-sm bg-[var(--surface-1)] p-4 rounded-xl overflow-x-auto">
      {JSON.stringify(result, null, 2)}
    </pre>
            );
        };


        return (
            <div className="max-w-[880px] mx-auto px-4 md:px-8 py-10">
                <div className="bg-[var(--card-bg)] text-[var(--card-text)] rounded-2xl shadow-md px-6 py-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Результат тесту</h1>

                    {/* ось тут заміна */}
                    <div className="text-lg mb-4">{renderResult()}</div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Набрано балів: {score}
                    </p>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => (window.location.href = "/cabinet/tests")}
                        className="px-6 py-3 bg-[#E0ECFF] text-black rounded-xl hover:bg-[#d6e4fa] transition"
                    >
                        Повернутись до списку тестів
                    </button>
                </div>
            </div>
        );
    }

    const question = test.questions[current];


    return (
    <div className="max-w-[880px] mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-center mb-6">
        <BackLink to={`/cabinet/tests/${id}`} />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">{test.title}</h1>
      <p className="text-gray-500 mb-6 text-center">
        Питання {current + 1} з {test.questions.length}
      </p>

        <div className="bg-[var(--card-bg)] text-[var(--card-text)] rounded-2xl shadow-md p-6">
            <p className="font-semibold text-lg text-[var(--text)] dark:text-gray-100 mb-4 text-center leading-snug">
                {question.text}
            </p>


            {question.type === "ordering" ? (
                <OrderingQuestion
                    testId={test.id}
                    options={
                        answers[current] && answers[current].length > 0
                            ? answers[current].map((val) =>
                                question.options.find((opt) => opt.value === val)
                            )
                            : [...question.options]
                    }
                    onChange={(order) => {
                        const newAnswers = [...answers];
                        newAnswers[current] = [...order]; // масив value
                        setAnswers(newAnswers);
                    }}
                />


            ) : (

                <div className="flex flex-col gap-2">
                    {question.options.map((opt, index) => (
                        <label
                            key={index}
                            className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${
                                String(answers[current]) === String(opt.value)
                                    ? "bg-[#E0ECFF] text-black border-blue-400"
                                    : "bg-[var(--surface-1)] border-[var(--border)] hover:bg-[var(--surface-2)]"
                            }`}
                        >
                            <input
                                type="radio"
                                name={`q${current}`}
                                value={opt.value}
                                className="hidden"
                                onChange={() => handleSelect(opt.value)}
                                checked={String(answers[current]) === String(opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}

            <button
                onClick={handleNext}
                disabled={
                    !["luscher", "geometric-delinger"].includes(test.id) &&
                    answers[current] === undefined
                }
                className={`mt-6 px-6 py-3 rounded-xl text-black transition ${
                    !["luscher", "geometric-delinger"].includes(test.id) && answers[current] === undefined
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#E0ECFF] hover:bg-[#d6e4fa]"
                }`}
            >
                {current + 1 === test.questions.length ? "Завершити" : "Далі"}
            </button>

        </div>
    </div>
  );
}
