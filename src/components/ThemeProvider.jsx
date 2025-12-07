// src/components/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null); // 👈 ключовий момент — початкове значення null

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setTheme(savedTheme);
  }, []);

    useEffect(() => {
        if (theme) {
            // Вимикаємо всі transition на мить
            document.body.classList.add("disable-transitions");

            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);

            // Вмикаємо назад через ~50мс
            setTimeout(() => {
                document.body.classList.remove("disable-transitions");
            }, 50);
        }
    }, [theme]);


    if (!theme) return null; // ❗❗❗ блокує весь рендер ДО ТОГО, як тема зʼявиться

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}
