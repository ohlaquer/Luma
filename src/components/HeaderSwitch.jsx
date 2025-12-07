import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider"; // ⬅️ Додаємо доступ до теми

export default function HeaderSwitch() {
  const [theme] = useTheme(); // ⬅️ Отримуємо активну тему
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⬅️ Ключ на тему = автоматичний ререндер при зміні теми
  return isMobile
    ? <MobileHeader key={theme} />
    : <DesktopHeader key={theme} />;
}
