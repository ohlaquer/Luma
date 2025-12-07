const defaultOptions = [
  { label: "Зовсім не відчуваю", value: 0 },
  { label: "Слабко/іноді", value: 1 },
  { label: "Помірно", value: 2 },
  { label: "Сильно/постійно", value: 3 },
];

export default {
    id: "beck-depression",
    title: "Шкала депресії Бека",
    description:
        "Методика Аарона Бека (BDI). Допомагає оцінити рівень депресивних симптомів — від емоційного стану до самооцінки та мотивації. Відповідай інтуїтивно, без пошуку 'правильних' варіантів.",
  time: "4–6 хв",
  category: "депресія",
  questions: [
    { text: "Сумний настрій", options: defaultOptions },
    { text: "Песимістичне сприйняття майбутнього", options: defaultOptions },
    { text: "Відчуття невдачі", options: defaultOptions },
    { text: "Незадоволеність собою", options: defaultOptions },
    { text: "Відчуття провини", options: defaultOptions },
    { text: "Очікування покарання", options: defaultOptions },
    { text: "Негативне ставлення до себе", options: defaultOptions },
    { text: "Суїцидальні думки", options: defaultOptions },
    { text: "Плаксивість", options: defaultOptions },
    { text: "Дратівливість", options: defaultOptions },
    { text: "Втрачений інтерес до людей чи занять", options: defaultOptions },
    { text: "Зниження здатності приймати рішення", options: defaultOptions },
    { text: "Почуття власної нікчемності", options: defaultOptions },
    { text: "Зниження енергії", options: defaultOptions },
    { text: "Порушення сну", options: defaultOptions },
    { text: "Втома або виснаження", options: defaultOptions },
    { text: "Зниження апетиту", options: defaultOptions },
    { text: "Зниження маси тіла", options: defaultOptions },
    { text: "Занепокоєння про своє здоров’я", options: defaultOptions },
    { text: "Втрачений інтерес до сексу", options: defaultOptions },
    { text: "Важко зосередитися", options: defaultOptions },
  ],
  interpret: (score) => {
    if (score <= 13)
      return "Легка або відсутня депресія. Ваші симптоми не перевищують нормальний емоційний фон.";
    if (score <= 19)
      return "Легка депресія. Можливо, Ви відчувате тимчасовий спад або емоційне навантаження.";
    if (score <= 28)
      return "Помірна депресія. Зверніть увагу на власний стан. Турбота про себе — не слабкість.";
    return "Виражена депресія. Якщо Вам складно — не залишайся наодинці.";
  },
};
