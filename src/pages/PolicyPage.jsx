import { useState } from 'react';
import ArrowDownLight from '../assets/icons/arrow-down-light.svg';
import ArrowDownDark from '../assets/icons/arrow-down-dark.svg';
import ArrowUpLight from '../assets/icons/arrow-up-light.svg';
import ArrowUpDark from '../assets/icons/arrow-up-dark.svg';

export default function PolicyPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

    const policies = [
        {
            title: 'Конфіденційність',
            content:
                'Твої записи, повідомлення та результати тестів залишаються приватними. Ми не передаємо особисті дані третім особам і не використовуємо їх у комерційних цілях. Для роботи деяких функцій (наприклад, аналізу емоцій чи спілкування з Luma) ми використовуємо API від компанії OpenAI. Це означає, що частина текстів тимчасово обробляється на їхньому сервері, але не зберігається й не використовується для навчання моделей. Ми дбаємо, щоб твої дані залишались у межах безпечного, етичного простору.',
        },
        {
            title: 'Безпека даних',
            content:
                'Усі з’єднання зашифровані. Ми не запитуємо зайвої інформації та не відстежуємо тебе поза межами платформи. Якщо щось виглядає підозріло — повідом нам про це.',
        },
        {
            title: 'Емоційна безпека',
            content:
                'Luma створена для підтримки, а не для тиску. Ми не ставимо діагнозів і не замінюємо психотерапію. Якщо тобі важко — звернись по допомогу до фахівців або на гарячу лінію підтримки.',
        },
        {
            title: 'Анонімність',
            content:
                'Ти можеш користуватись платформою, не розкриваючи свою особу. Ми цінуємо твою довіру і не просимо нічого, що не потрібно для роботи сервісу.',
        },
        {
            title: 'Оновлення політики',
            content:
                'Ми час від часу оновлюємо політику, щоб зробити її простішою та чеснішою. Про важливі зміни повідомлятимемо на сайті.',
        },
    ];


    const terms = [
        {
            title: 'Як користуватись Luma',
            content:
                'Luma — це простір для спокою, рефлексії та розмови. Використовуй її так, як зручно тобі: пиши, аналізуй, думай уголос. Єдине правило — будь до себе чесним і бережним.',
        },
        {
            title: 'Про обмеження',
            content:
                'Luma не замінює психотерапію, лікаря чи екстрену допомогу. Це інструмент підтримки, а не діагноз. Якщо відчуваєш гострий стан — звернись до фахівців або гарячої лінії підтримки.',
        },
        {
            title: 'Контент і авторські права',
            content:
                'Дизайн, тексти, логіка й структура платформи належать команді Luma. Ти можеш ділитися частинами сайту, якщо вказуєш джерело. Просто не видавай наш котел програмного коду за свій 😄',
        },
        {
            title: 'Обліковий запис',
            content:
                'Подбай про безпеку свого акаунта. Якщо користуєшся спільним пристроєм — виходь після сесії. Ми надсилаємо листи лише для підтвердження пошти та відновлення доступу. Luma ніколи не просить пароль і не пише підозрілих повідомлень із вимогою «підтвердити дані».',
        },

        {
            title: 'Зворотний зв’язок і зміни',
            content: `
        Luma постійно росте, як і її користувачі. Ми можемо оновлювати умови, щоб зробити сервіс зручнішим. 
        Якщо маєш ідеї, пропозиції або помітив баг — просто напиши нам на 
        <a href="mailto:support@lumaproject.work" class="underline text-blue-500 dark:text-blue-300">
            support@lumaproject.work
        </a>.
        Тут все будується на діалозі.
    `,
        }

    ];


    const renderArrow = (isOpen) => (
    <div className="relative w-4 h-4">
      <img
        src={isOpen ? ArrowUpLight : ArrowDownLight}
        alt="Arrow Light"
        className="absolute inset-0 w-4 h-4 dark-hidden"
      />
      <img
        src={isOpen ? ArrowUpDark : ArrowDownDark}
        alt="Arrow Dark"
        className="absolute inset-0 w-4 h-4 hidden dark-block"
      />
    </div>
  );

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--card-text)',
    borderColor: 'var(--hover)',
  };

  const titleStyle = {
    color: 'var(--text)',
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full px-6 py-12 space-y-16">
      <section>
        <h1 className="text-3xl font-bold mb-8" style={titleStyle}>
          Політика і безпека
        </h1>
        <div className="space-y-4">
          {policies.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border shadow-md transition-all duration-300"
                style={cardStyle}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left flex items-center justify-between px-6 py-4 font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {item.title}
                  {renderArrow(isOpen)}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 px-6 pb-4' : 'max-h-0 px-6'
                  }`}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--card-text)' }}
                  >
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-8" style={titleStyle}>
          Умови використання
        </h1>
        <div className="space-y-4">
          {terms.map((item, index) => {
            const adjustedIndex = index + policies.length;
            const isOpen = openIndex === adjustedIndex;
            return (
              <div
                key={index}
                className="rounded-xl border shadow-md transition-all duration-300"
                style={cardStyle}
              >
                <button
                  onClick={() => toggle(adjustedIndex)}
                  className="w-full text-left flex items-center justify-between px-6 py-4 font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {item.title}
                  {renderArrow(isOpen)}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 px-6 pb-4' : 'max-h-0 px-6'
                  }`}
                >
                    <div
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--card-text)' }}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
