import { useTheme } from "./ThemeProvider";
import HeaderSwitch from "./HeaderSwitch";
import MobileFooter from "./MobileFooter";
import DesktopFooter from "./DesktopFooter";
import { useLocation } from "react-router-dom";


export default function Layout({ children, onToggleTheme, center }) {
    const [theme] = useTheme();
    const { pathname } = useLocation();

    // Вимикаємо вертикальне центрування на будь-яких роутерах, де є "journal"
    const isJournalRoute =
        pathname?.toLowerCase().includes("journal") ||
        pathname?.toLowerCase().includes("щоденник"); // якщо раптом так названо

    // Якщо center переданий пропом — він головний; інакше: центруємо все, КРІМ journal
    const shouldCenter = typeof center === "boolean" ? center : !isJournalRoute;

    const mainCentered =
        "flex-grow flex flex-col justify-center items-center px-4 md:px-10";
    const mainNotCentered =
        "flex-grow flex flex-col justify-start items-stretch w-full px-4 md:px-10";

    return (
        <div
            className="flex flex-col min-h-[100dvh] bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300 overflow-hidden"
        >
            {/* Хедер сайту */}
            <HeaderSwitch onToggleTheme={onToggleTheme} />

            {/* Основний вміст: скрізь центр — крім journal-роутів */}
            <main className={shouldCenter ? mainCentered : mainNotCentered}>
                {children}
            </main>

            {/* Футери */}
            <div className="md:hidden">
                <MobileFooter />
            </div>
            <div className="hidden md:block">
                <DesktopFooter />
            </div>
        </div>
    );
}
