// src/tests/luscher.js

function shuffle(array) {
    let a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const baseColors = [
    { label: "Синій", value: "blue" },
    { label: "Зелений", value: "green" },
    { label: "Червоний", value: "red" },
    { label: "Жовтий", value: "yellow" },
    { label: "Фіолетовий", value: "purple" },
    { label: "Коричневий", value: "brown" },
    { label: "Чорний", value: "black" },
    { label: "Сірий", value: "gray" },
];

export default {
    id: "luscher",
    title: "Кольоровий тест",
    description:
        "Методика Макса Люшера. Пропонує двічі впорядкувати вісім кольорів за рівнем привабливості. Тест відображає емоційний стан, рівень напруги та внутрішню гармонію.",
    time: "5–7 хв",
    category: "емоційний стан",
    questions: [
        {
            text: "Перший прохід: упорядкуй ці кольори від найбільш привабливого до найменш привабливого.",
            options: shuffle(baseColors),
            type: "ordering",
        },
        {
            text: "Другий прохід: упорядкуй ті ж самі кольори ще раз.",
            options: shuffle(baseColors), // 👈 новий shuffle
            type: "ordering",
        },
    ],
    interpret: (answers) => {
        if (
            !answers ||
            !answers[0] ||
            !answers[1] ||
            !Array.isArray(answers[0]) ||
            !Array.isArray(answers[1])
        ) {
            return { error: "Результати тесту некоректні 😔" };
        }

        const getValue = (item) => (typeof item === "string" ? item : item.value);

        const first = answers[0].map(getValue);
        const second = answers[1].map(getValue);

        const descriptions = {
            blue: "Синій — потреба у спокої, гармонії, відпочинку.",
            green: "Зелений — наполегливість, впевненість, стабільність.",
            red: "Червоний — енергія, активність, бажання досягати.",
            yellow: "Жовтий — оптимізм, орієнтація на майбутнє.",
            purple: "Фіолетовий — чутливість, мрійливість, емоційність.",
            brown: "Коричневий — комфорт, турбота про тіло.",
            black: "Чорний — протест, внутрішня напруга.",
            gray: "Сірий — відстороненість, нейтральність.",
        };

        // таблиця: порівняння першого і другого проходу
        const table = first.map((color, idx) => {
            const secondPos = second.indexOf(color);
            return {
                color: descriptions[color].split(" — ")[0], // тільки назва
                first: idx + 1,
                second: secondPos + 1,
            };
        });

        // аналіз
        const analysis = [];
        first.forEach((color, idx) => {
            const secondPos = second.indexOf(color);
            if (secondPos === idx) {
                analysis.push(`${descriptions[color]} (стабільна потреба)`);
            } else if (secondPos > idx + 2) {
                analysis.push(`${descriptions[color]} (витіснене, зниження значущості)`);
            } else if (secondPos < idx - 2) {
                analysis.push(`${descriptions[color]} (приховане прагнення, посилення)`);
            }
        });

        return {
            table,
            analysis,
            note: "Це спрощена інтерпретація. Для повного аналізу потрібна робота з психотерапевтом.",
        };
    },
};
