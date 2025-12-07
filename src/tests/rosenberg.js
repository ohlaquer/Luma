const defaultOptions = [
    { label: "Повністю згоден", value: 3 },
    { label: "Скоріше згоден", value: 2 },
    { label: "Скоріше не згоден", value: 1 },
    { label: "Зовсім не згоден", value: 0 },
];

const reversedOptions = [...defaultOptions].reverse();

export default {
    id: "rosenberg",
    title: "Тест самооцінки",
    description:
        "Методика Морріса Розенберга. Допомагає оцінити рівень загальної самооцінки та ставлення до себе. Тут немає «правильних» відповідей — важливо лише бути чесним і уважним до власних відчуттів.",
    time: "2–4 хв",
    category: "самооцінка",
    questions: [
        { text: "У загальному я задоволений собою.", options: defaultOptions },
        { text: "Іноді я відчуваю, що я нічого не вартий.", options: reversedOptions },
        { text: "Я відчуваю, що маю багато позитивних якостей.", options: defaultOptions },
        { text: "Я здатен робити речі не гірше за інших.", options: defaultOptions },
        { text: "Я відчуваю, що не маю чим пишатись.", options: reversedOptions },
        { text: "Я ставлюсь до себе з повагою.", options: defaultOptions },
        { text: "Іноді я думаю, що я невдаха.", options: reversedOptions },
        { text: "Я відчуваю, що я гідний поваги.", options: defaultOptions },
        { text: "Хотів би мати більше самоповаги.", options: reversedOptions },
        { text: "Загалом, я маю позитивне ставлення до себе.", options: defaultOptions },
    ],
    interpret: (answers) => {
        const score = answers.reduce((a, b) => a + (parseInt(b) || 0), 0);

        let level = "";
        if (score <= 14) {
            level =
                "Низька самооцінка. Це не вирок — це точка старту для турботи про себе";
        } else if (score <= 25) {
            level =
                "Середній рівень самооцінки. Є впевненість, але й моменти сумніву. Це нормально.";
        } else {
            level =
                "Висока самооцінка. Ти в цілому задоволений собою та впевнений у своїх силах — кайф!";
        }

        return {
            scales: {
                SelfEsteem: {
                    title: "Загальна самооцінка",
                    score,
                    description: level,
                },
            },
            note: `Шкала інтерпретації:
0–14 = низька самооцінка
15–25 = середня самооцінка
26–30 = висока самооцінка`,
        };
    },
};
