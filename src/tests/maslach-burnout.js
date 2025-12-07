const defaultOptions = [
  { label: "Ніколи", value: 0 },
  { label: "Рідко", value: 1 },
  { label: "Іноді", value: 2 },
  { label: "Часто", value: 3 },
  { label: "Дуже часто", value: 4 },
  { label: "Завжди", value: 5 },
];

export default {
    id: "maslach-burnout",
    title: "Тест на емоційне вигорання",
    description:
        "Методика Крістіни Маслач (MBI). Визначає рівень емоційного вигорання за трьома аспектами: виснаження, відсторонення та відчуття власної ефективності. Допомагає зрозуміти, наскільки робоче чи навчальне навантаження впливає на твій внутрішній стан.",
  time: "7–10 хв",
  category: "вигорання",
  questions: [
    { text: "Я почуваюсь емоційно виснаженим через свою роботу.", options: defaultOptions },
    { text: "Я відчуваю себе вичавленим наприкінці робочого дня.", options: defaultOptions },
    { text: "Я почуваюся втомленим ще до початку робочого дня.", options: defaultOptions },
    { text: "Я втомлений від спілкування з людьми на роботі.", options: defaultOptions },
    { text: "Я відчуваю, що моя робота виснажує мене емоційно.", options: defaultOptions },
    { text: "Я починаю ставитися до клієнтів/колег як до об'єктів, а не людей.", options: defaultOptions },
    { text: "Я став холоднішим у спілкуванні з іншими через роботу.", options: defaultOptions },
    { text: "Я думаю, що мені байдуже до того, що відчувають інші.", options: defaultOptions },
    { text: "Я відчуваю себе неефективним у своїй роботі.", options: defaultOptions },
    { text: "Я втрачаю інтерес до досягнень на роботі.", options: defaultOptions },
    { text: "Я відчуваю, що більше не приношу користі іншим.", options: defaultOptions },
    { text: "Я почуваюсь менш компетентним, ніж раніше.", options: defaultOptions },
    { text: "Я більше не бачу сенсу у своїй роботі.", options: defaultOptions },
    { text: "Я відчуваю, що робота більше не приносить задоволення.", options: defaultOptions },
    { text: "Я почуваюсь цинічно щодо того, чим займаюсь.", options: defaultOptions },
  ],
    interpret: (answers) => {
        if (!Array.isArray(answers) || answers.length < 15) {
            return { error: "Потрібно відповісти на всі питання (15)." };
        }

        // розбивка на підшкали
        const EE = answers.slice(0, 5).reduce((a, b) => a + b, 0);
        const DP = [answers[5], answers[6], answers[7], answers[14]].reduce((a, b) => a + b, 0);
        const PA = answers.slice(8, 14).reduce((a, b) => a + b, 0);

        // інтерпретація рівнів
        const level = (val, low, mid) => {
            if (val <= low) return "Низький";
            if (val <= mid) return "Середній";
            return "Високий";
        };

        return {
            scales: {
                EE: {
                    title: "Емоційне виснаження",
                    score: EE,
                    level: level(EE, 16, 27),
                },
                DP: {
                    title: "Деперсоналізація",
                    score: DP,
                    level: level(DP, 6, 12),
                },
                PA: {
                    title: "Редукція особистих досягнень",
                    score: PA,
                    level: level(PA, 22, 36),
                },
            },
            note: `Вигорання вважається високим, якщо одночасно:
- Емоційне виснаження (EE) високе
- Деперсоналізація (DP) висока
- Особисті досягнення (PA) низькі

Шкали інтерпретації:
EE (Емоційне виснаження): 0–16 = низький, 17–27 = середній, 28+ = високий
DP (Деперсоналізація): 0–6 = низький, 7–12 = середній, 13+ = високий
PA (Особисті досягнення): 0–22 = низький, 23–36 = середній, 37+ = високий`,
        };
    }


};
