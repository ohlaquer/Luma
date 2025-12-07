import { Link } from "react-router-dom";
import BackLink from "../components/BackLink";

// Імпорти світлих і темних картинок
import body from "../assets/images/resources/body.png";
import bodyDark from "../assets/images/resources/body-dark.png";
import breath from "../assets/images/resources/breath.png";
import breathDark from "../assets/images/resources/breath-dark.png";
import cognitive from "../assets/images/resources/cognitive.png";
import cognitiveDark from "../assets/images/resources/cognitive-dark.png";
import grounding from "../assets/images/resources/grounding.png";
import groundingDark from "../assets/images/resources/grounding-dark.png";
import sensory from "../assets/images/resources/sensory.png";
import sensoryDark from "../assets/images/resources/sensory-dark.png";
import reflection from "../assets/images/resources/reflection.png";
import reflectionDark from "../assets/images/resources/reflection-dark.png";
import art from "../assets/images/resources/art.png";
import artDark from "../assets/images/resources/art-dark.png";
import boundaries  from "../assets/images/resources/boundaries.png";
import boundariesDark from "../assets/images/resources/boundaries-dark.png";

export default function ResourceSpacePage() {
  const resources = [
    {
      title: "Тілесні практики",
      imgLight: body,
      imgDark: bodyDark,
      link: "/cabinet/resource/body",
    },
    {
      title: "Дихальні вправи",
      imgLight: breath,
      imgDark: breathDark,
      link: "/cabinet/resource/breath",
    },
    {
      title: "Когнітивна стабілізація",
      imgLight: cognitive,
      imgDark: cognitiveDark,
      link: "/cabinet/resource/cognitive",
    },
    {
      title: "Заземлення",
      imgLight: grounding,
      imgDark: groundingDark,
      link: "/cabinet/resource/grounding",
    },
    {
      title: "Сенсорне заспокоєння",
      imgLight: sensory,
      imgDark: sensoryDark,
      link: "/cabinet/resource/sensory",
    },
    {
      title: "Запис і саморефлексія",
      imgLight: reflection,
      imgDark: reflectionDark,
      link: "/cabinet/resource/reflection",
    },
    {
      title: "Арт-методики",
      imgLight: art,
      imgDark: artDark,
      link: "/cabinet/resource/art",
    },
    {
      title: "Свідомі межі",
      imgLight: boundaries, // або створиш окрему іконку boundaries.png
      imgDark: boundariesDark,
      link: "/cabinet/resource/boundaries",
    },
  ];

  const ResourceCard = ({ title, imgLight, imgDark, link }) => (
    <Link
      to={link}
      className="w-[270px] h-[180px] rounded-2xl overflow-hidden shadow-md transition-transform transform will-change-transform duration-300 ease-out hover:scale-[1.02] hover:brightness-105 hover:shadow-lg flex flex-col"
      style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
    >
      <div className="relative flex-grow bg-[var(--surface-1)] dark:bg-[var(--surface-2)]">
        <img
          src={imgLight}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain dark:hidden"
        />
        <img
          src={imgDark}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain hidden dark:block"
        />
      </div>

      <div
        className="text-center py-2 text-sm font-medium backdrop-blur-sm transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-overlay)",
          color: "var(--card-text)",
        }}
      >
        {title}
      </div>
    </Link>
  );

  return (
    <div
      className="w-full px-4 md:px-8 py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-[880px] mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <BackLink />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Це набір технік, які допоможуть тобі стабілізуватись
        </h1>
        <p
          className="text-base max-w-3xl mx-auto"
          style={{ color: "var(--muted-text)" }}
        >
          У складні моменти — емоційно, фізично й ментально. Обери те, що підходить саме тобі.
        </p>
      </div>

      <section className="flex flex-wrap justify-center gap-4 mb-4">
        {resources.slice(0, 4).map((item, index) => (
          <ResourceCard
            key={index}
            title={item.title}
            imgLight={item.imgLight}
            imgDark={item.imgDark}
            link={item.link}
          />
        ))}
      </section>

      <section className="flex flex-wrap justify-center gap-4">
        {resources.slice(4).map((item, index) => (
          <ResourceCard
            key={index + 4}
            title={item.title}
            imgLight={item.imgLight}
            imgDark={item.imgDark}
            link={item.link}
          />
        ))}
      </section>
    </div>
  );
}