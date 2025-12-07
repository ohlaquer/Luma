import React, { useState, useEffect } from "react";
import { Popover } from "@headlessui/react";
import IconLight from "../assets/icons/accessibility-icon-light.svg";
import IconDark from "../assets/icons/accessibility-icon-dark.svg";
import { Info } from "lucide-react";

export default function AccessibilitySettings() {
    const [isAccessible, setIsAccessible] = useState(() =>
        localStorage.getItem("accessibilityMode") === "true"
    );
    const [isDyslexiaFont, setIsDyslexiaFont] = useState(() =>
        localStorage.getItem("dyslexiaFont") === "true"
    );
    const [highContrast, setHighContrast] = useState(() =>
        localStorage.getItem("highContrast") === "true"
    );
    const [colorBlindMode, setColorBlindMode] = useState(
        localStorage.getItem("colorBlindMode") || ""
    );
    const [isSoftMode, setIsSoftMode] = useState(() =>
        localStorage.getItem("softMode") === "true"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("soft", isSoftMode);
        localStorage.setItem("softMode", isSoftMode);
    }, [isSoftMode]);

    useEffect(() => {
        document.documentElement.classList.remove(
            "colorblind-protanopia",
            "colorblind-deuteranopia",
            "colorblind-tritanopia",
            "colorblind-achromatopsia"
        );
        if (colorBlindMode)
            document.documentElement.classList.add(`colorblind-${colorBlindMode}`);
        localStorage.setItem("colorBlindMode", colorBlindMode);
    }, [colorBlindMode]);

    useEffect(() => {
        document.documentElement.classList.toggle("high-contrast", highContrast);
        localStorage.setItem("highContrast", highContrast);
    }, [highContrast]);

    useEffect(() => {
        document.documentElement.classList.toggle("accessible", isAccessible);
        localStorage.setItem("accessibilityMode", isAccessible);
    }, [isAccessible]);

    useEffect(() => {
        document.documentElement.classList.toggle("dyslexia-font", isDyslexiaFont);
        localStorage.setItem("dyslexiaFont", isDyslexiaFont);
    }, [isDyslexiaFont]);

    return (
        <Popover className="relative">
            <Popover.Button
                aria-label="Налаштування доступності"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
                <img src={IconLight} alt="Accessibility" className="w-6 h-6 dark:hidden" />
                <img src={IconDark} alt="Accessibility" className="w-6 h-6 hidden dark:block" />
            </Popover.Button>

            <Popover.Panel
                className="PopoverPanelFix absolute right-0 top-full z-50 mt-2 w-[90vw] max-w-xs
             bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-4
             flex flex-col gap-5 max-h-[80vh] overflow-y-auto overflow-x-hidden
             border border-gray-100 dark:border-gray-800
             origin-top transition-all duration-200 ease-out
             data-[headlessui-state=open]:scale-100 scale-95"
            >

            <h3 className="text-center text-sm font-semibold text-[var(--text)] mb-1">
                    Налаштування доступності
                </h3>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {/* === Режим доступності === */}
                <SettingBlock
                    label="Режим доступності"
                    description="Підвищує контрастність і читабельність тексту, додає розширені відступи для зручності."
                    active={isAccessible}
                    onToggle={() => setIsAccessible(!isAccessible)}
                />

                <Divider />

                {/* === Шрифт для дислексії === */}
                <SettingBlock
                    label="Шрифт для дислексії"
                    description="Використовує спеціальний шрифт ADYS, який зменшує злиття літер і покращує фокусування під час читання."
                    active={isDyslexiaFont}
                    onToggle={() => setIsDyslexiaFont(!isDyslexiaFont)}
                />

                <Divider />

                {/* === Високий контраст === */}
                <SettingBlock
                    label="Високий контраст"
                    description="Посилює кольоровий контраст інтерфейсу для користувачів із порушеннями зору або низькою контрастною чутливістю."
                    active={highContrast}
                    onToggle={() => setHighContrast(!highContrast)}
                />

                <Divider />

                {/* === Спокійний режим === */}
                <SettingBlock
                    label="Спокійний режим"
                    description="Пом’якшує палітру інтерфейсу, знижує контраст і додає теплі відтінки. Допомагає розслабитися під час тривалої роботи."
                    active={isSoftMode}
                    onToggle={() => setIsSoftMode(!isSoftMode)}
                />

                <Divider />

                {/* === Режими дальтонізму === */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
            <span className="text-sm text-[#34495E] dark:text-gray-100 flex items-center gap-2">
              Режим кольоросприйняття
              <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: "", label: "Звичайне" },
                            { id: "protanopia", label: "Протанопія" },
                            { id: "deuteranopia", label: "Дейтеранопія" },
                            { id: "tritanopia", label: "Тританопсія" },
                            { id: "achromatopsia", label: "Ахроматопсія" },
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setColorBlindMode(mode.id)}
                                className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 border 
                  ${
                                    colorBlindMode === mode.id
                                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    );
}

function SettingBlock({ label, description, active, onToggle }) {
    return (
        <div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-[#34495E] dark:text-gray-100">{label}</span>
                <button
                    onClick={onToggle}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition 
            ${
                        active
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                >
                    {active ? "Увімкнено" : "Вимкнено"}
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-1">{description}</p>
        </div>
    );
}

function Divider() {
    return <div className="h-[1px] bg-gray-200 dark:bg-gray-700" />;
}
