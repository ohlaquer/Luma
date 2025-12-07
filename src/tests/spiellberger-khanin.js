const defaultOptions = [
  { label: "Ні", value: 1 },
  { label: "Скоріше ні", value: 2 },
  { label: "Скоріше так", value: 3 },
  { label: "Так", value: 4 },
];

export default {
    id: "spiellberger-khanin",
    title: "Тест на рівень тривожності",
    description:
        "Методика Ч. Спілбергера та Ю. Ханіна. Визначає два типи тривожності — ситуативну (пов’язану з конкретними подіями) і особистісну (як стабільну рису характеру). Тест допомагає краще зрозуміти, як ти реагуєш на напружені ситуації.",
  time: "5–7 хв",
  category: "тривожність",
  questions: [
    // Ситуативна (перші 10)
    { text: "Я спокійний.", options: defaultOptions },
    { text: "Я відчуваю напругу.", options: defaultOptions },
    { text: "Я внутрішньо врівноважений.", options: defaultOptions },
    { text: "Я почуваюся тривожно.", options: defaultOptions },
    { text: "Я впевнений у собі.", options: defaultOptions },
    { text: "Я нервуюсь.", options: defaultOptions },
    { text: "Я почуваюся захищеним.", options: defaultOptions },
    { text: "Я відчуваю себе розгубленим.", options: defaultOptions },
    { text: "Я спокійно сприймаю речі.", options: defaultOptions },
    { text: "Я стривожений.", options: defaultOptions },

    // Особистісна (наступні 10)
    { text: "Я часто відчуваю тривогу.", options: defaultOptions },
    { text: "Мене легко роздратувати.", options: defaultOptions },
    { text: "Я часто переживаю через дрібниці.", options: defaultOptions },
    { text: "Я почуваю себе впевнено у більшості ситуацій.", options: defaultOptions },
    { text: "Я часто нервуюсь без причини.", options: defaultOptions },
    { text: "Я вважаю себе емоційно стабільною людиною.", options: defaultOptions },
    { text: "Мене легко вивести з рівноваги.", options: defaultOptions },
    { text: "Я часто передчуваю щось погане.", options: defaultOptions },
    { text: "Я спокійно реагую на проблеми.", options: defaultOptions },
    { text: "Мене не так легко налякати чи засмутити.", options: defaultOptions },
  ],
    interpret: (answers) => {
        if (!Array.isArray(answers) || answers.length < 20) {
            return { error: "Потрібно відповісти на всі 20 питань." };
        }

        const situational = answers.slice(0, 10).reduce((a, b) => a + (parseInt(b) || 0), 0);
        const personal = answers.slice(10, 20).reduce((a, b) => a + (parseInt(b) || 0), 0);

        const level = (score) => {
            if (score <= 20) return "Низький рівень тривожності";
            if (score <= 30) return "Середній рівень тривожності";
            return "Високий рівень тривожності";
        };

        return {
            scales: {
                ST: {
                    title: "Ситуативна тривожність",
                    score: situational,
                    description: level(situational),
                },
                OT: {
                    title: "Особистісна тривожність",
                    score: personal,
                    description: level(personal),
                },
            },
            note: `Шкала інтерпретації (для кожної підшкали):
10–20 = низький рівень
21–30 = середній рівень
31–40 = високий рівень`,
        };
    },

};
// розділити обчислення тесту на 2