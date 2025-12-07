import { Card, CardContent } from '../components/card';

export default function PsychologicalSupportPage() {
  const resources = [
    {
      title: 'Гаряча лінія – 0‑800‑100‑102',
      desc: 'Всеукраїнська психологічна гаряча лінія (10:00–20:00, відео-консультації)'
    },
    {
      title: 'СЕНС (Львів)',
      desc: 'Психотерапія (індивідуальна, сімейна, дитяча), офіси на Лемківській та Стрийській.',
      phone: '067 48 48 466 / 097 599 00 23',
      email: 'centr.sens@gmail.com',
      link: 'https://www.sens.lviv.ua/'
    },
    {
      title: 'Взаємодія (Львів)',
      desc: 'Консультації психолога та психотерапевта, Пн–Пт 10:00–20:00.',
      phone: '+380 93 876 33 16',
      email: 'vzaemodia.lviv@gmail.com',
      link: 'https://vzaemodia.com/'
    },
    {
      title: 'Метод (Львів)',
      desc: 'Професійна психотерапія у затишному центрі.',
      phone: '+380 98 755 5100',
      email: 'metod.lviv@gmail.com',
      link: 'https://method.com.ua/'
    },
    {
      title: 'VerDE (Львів)',
      desc: 'Центр психотерапії — кілька локацій у Львові.',
      phone: '+380 67 47 11 073 / +380 63 86 85 412',
      email: 'verde.lviv@gmail.com',
      link: 'https://verde.lviv.ua/'
    },
    {
      title: 'Центр "Я Є Help" (Київ)',
      desc: 'Сімейна терапія, онлайн/офлайн, безпечний простір.',
      phone: '0800 33 45 03 • +380 67 575 32 21',
      email: 'psychologicalcenter.ya.e@gmail.com',
      link: 'https://www.ya-e.com/'
    },
    {
      title: 'Інститут соціальної та політичної психології (Київ)',
      desc: 'Науково–практична психологія, консультації.',
      phone: '+38 044 425 24 08',
      email: 'info@ispp.org.ua',
      link: 'http://ispp.org.ua/'
    },
    {
      title: 'Студія СОВА (Київ)',
      desc: 'Затишні кабінети, Пн–Пт 08:00–19:00.',
      phone: '093‑106‑80‑36',
      link: 'https://studiya-sova.com/'
    },
    {
      title: 'Lifeline Ukraine (для ветеранів)',
      phone: '7333 (цілодобово)',
      link: 'https://lifelineukraine.com/'
    },
    {
      title: 'La Strada (домашнє насильство)',
      phone: '0 800 500 335, 116123',
      email: 'hotline@la-strada.gov.ua',
      link: 'https://la-strada.org.ua/'
    },
    {
      title: 'Дитяча гаряча лінія',
      phone: '0 800 500 225, 116111 (12:00–20:00)',
      link: 'https://www.mh4u.in.ua/phones/'
    },
    {
      title: 'Кризова порадня УКУ',
      phone: '+380 96 580 76 88, +380 50 073 29 03, +380 96 581 48 96, +380 93 434 77 01, +380 95 874 40 62'
    },
    {
      title: 'Психологічна допомога (Київ)',
      phone: '+380 63 322 83 79, +380 50 736 62 08, +380 50 699 16 23, +380 67 279 44 34'
    },
    {
      title: 'FriendFirstAidBot',
      desc: 'Телеграм-бот першої психологічної допомоги',
      link: 'https://t.me/FriendFirstAidBot'
    },
    {
      title: 'KrisenchatUA_bot',
      desc: 'Безкоштовна цілодобова підтримка в Telegram',
      link: 'https://t.me/KrisenchatUA_bot'
    },
    {
      title: 'Людина в біді',
      phone: '0 800 210 160 (цілодобово)',
      link: 'https://www.peopleinneed.net/'
    },
    {
      title: 'UA Mental Help',
      phone: '0800 331 200 (9:00–21:00)',
      link: 'https://www.mentalhelp.com.ua/'
    },
    {
      title: 'Порадня УСП',
      phone: '+380 97 112 4591 (пн–пт 10:00–20:00)'
    },
    {
      title: 'Центр НаУКМА',
      phone: '0800 333 234 (пн–сб 8:00–20:00)',
      link: 'https://www.ukma.edu.ua/'
    },
    {
      title: 'МОЗ – Ветеранська підтримка',
      phone: '0800 33 20 29',
      link: 'https://moz.gov.ua/uk/kontakti-psihologichnoyi-pidtrimki-dlya-civilnih-dlya-veteraniv-dlya-ditej-i-pidlitkiv-dlya-vpo-i-postrazhdalih-vid-vijni'
    },
    {
      title: 'МОЗ – Контакт-центр',
      phone: '0800 60 20 19',
      link: 'https://moz.gov.ua/uk/kontakti-psihologichnoyi-pidtrimki-dlya-civilnih-dlya-veteraniv-dlya-ditej-i-pidlitkiv-dlya-vpo-i-postrazhdalih-vid-vijni'
    },
    {
      title: 'ЧКХ Crisis Line',
      phone: '0800 300 155',
      link: 'https://www.bf.diia.gov.ua/articles/yak-otrymaty-psykholohichnu-dopomohu-v-umovakh-viiny'
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col text-lg font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-4">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Психологічна підтримка
          </h1>

          {resources.map((r) => (
            <Card key={r.title}>
              <CardContent>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {r.link ? (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:opacity-90 transition"
                      style={{ color: 'var(--text)' }}
                    >
                      {r.title}
                    </a>
                  ) : (
                    r.title
                  )}
                </h2>

                {r.desc && (
                  <p className="mt-1" style={{ color: 'var(--card-text)' }}>
                    {r.desc}
                  </p>
                )}

                {r.phone && (
                  <p className="mt-2" style={{ color: 'var(--card-text)' }}>
                    📞 {r.phone}
                  </p>
                )}

                {r.email && (
                  <p style={{ color: 'var(--card-text)' }}>
                    ✉️ {r.email}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
