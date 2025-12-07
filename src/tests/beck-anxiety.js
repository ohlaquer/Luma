// src/tests/beck-anxiety.js
const defaultOptions = [
    { label: "Зовсім не турбує", value: 0 },
    { label: "Легкий ступінь", value: 1 },
    { label: "Помірний ступінь", value: 2 },
    { label: "Важкий / постійний", value: 3 },
];

export default {
    id: "beck-anxiety",
    title: "Шкала тривожності Бека",
    description:
        "Методика Аарона Бека (BAI). Визначає рівень тривожності на основі частоти фізичних і емоційних симптомів. Допомагає краще зрозуміти, як часто напруга чи хвилювання впливають на повсякденне життя.",
    time: "4–6 хв",
    category: "тривожність",
    questions: [
        { text: "Оніміння або поколювання", options: defaultOptions },
        { text: "Відчуття жару", options: defaultOptions },
        { text: "Дрижання у ногах", options: defaultOptions },
        { text: "Нездатність розслабитися", options: defaultOptions },
        { text: "Страх, що може статися найгірше", options: defaultOptions },
        { text: "Запаморочення або відчуття легкості у голові", options: defaultOptions },
        { text: "Прискорене серцебиття", options: defaultOptions },
        { text: "Нестійкість", options: defaultOptions },
        { text: "Відчуття жаху", options: defaultOptions },
        { text: "Нервозність", options: defaultOptions },
        { text: "Відчуття задишки", options: defaultOptions },
        { text: "Тремтіння у руках", options: defaultOptions },
        { text: "Відчуття слабкості", options: defaultOptions },
        { text: "Страх втратити контроль", options: defaultOptions },
        { text: "Труднощі з диханням", options: defaultOptions },
        { text: "Страх смерті", options: defaultOptions },
        { text: "Переляк", options: defaultOptions },
        { text: "Проблеми зі шлунком (нудота, дискомфорт)", options: defaultOptions },
        { text: "Відчуття непритомності", options: defaultOptions },
        { text: "Почервоніння обличчя", options: defaultOptions },
        { text: "Потовиділення (не пов'язане з жаром)", options: defaultOptions },
    ],
    interpret: (score) => {
        if (score <= 7)
            return "Мінімальна тривожність (0–7). Симптоми відсутні або майже непомітні.";
        if (score <= 15)
            return "Легка тривожність (8–15). Симптоми є, але не заважають повсякденному життю.";
        if (score <= 25)
            return "Помірна тривожність (16–25). Симптоми помітні й створюють дискомфорт.";
        return "Висока тривожність (26–63). Симптоми значні та можуть впливати на якість життя.";
    },
};
