import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider"; // ✅ оновлено

export default function ThemeToggleIconButton() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Перемкнути тему"
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-[#34495E]" />
      )}
    </button>
  );
}
