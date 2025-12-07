import { CircleX } from "lucide-react";

export default function MoodBadge({ meta, onRemove }) {
    if (!meta) return null;

    const time = new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const limitItems = (arr) => {
        if (!arr || arr.length === 0) return null;
        if (arr.length <= 2) return arr.join(", ");
        return `${arr.slice(0, 2).join(", ")} тощо`;
    };

    const moodFallbackMap = {
        "Дуже погано": "Дуже неприємний момент",
        "Погано": "Поганий момент",
        "Скоріше погано": "Сумнівний момент",
        "Нейтрально": "Нейтральний момент",
        "Скоріше добре": "Приємний момент",
        "Добре": "Дуже приємний момент",
        "Дуже добре": "Чудовий момент",
    };

    const hasTags = Array.isArray(meta.tags) && meta.tags.length > 0;
    const reasonsText = limitItems(meta.reasons);
    const hasReasons = !!reasonsText;

    const moodText =
        (hasTags ? limitItems(meta.tags) : moodFallbackMap[meta.moodLabel]) ||
        "Без емоцій";

    const toLinearFromAny = (grad) => {
        if (!grad) return null;
        const stops = grad.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g);
        if (!stops || stops.length === 0) return null;
        const first = stops[0];
        const last = stops[stops.length - 1];
        return `linear-gradient(to bottom, ${first} 0%, ${last} 100%)`;
    };

    return (
        <div
            className={`mx-5 mt-2 mb-3 p-3 rounded-xl flex ${
                hasReasons ? "items-start" : "items-center"
            } gap-3 relative shadow-sm overflow-hidden`}
            style={{
                backgroundImage:
                    meta?.colors
                        ? `linear-gradient(to bottom, ${meta.colors.center} 0%, ${meta.colors.edge} 100%)`
                        : toLinearFromAny(meta?.gradient) ?? undefined,
                backgroundColor:
                    !meta?.colors && !meta?.gradient ? "#f8f8f8" : undefined,
            }}
        >
            {/* Емодзі */}
            <div className="flex items-center justify-center w-14 h-14 text-[44px] leading-none">
                <span
                    className="block"
                    style={{
                        transform: hasReasons
                            ? "translateY(2px)"
                            : "translateY(0)",
                    }}
                >
                    {meta.moodEmoji || "💤"}
                </span>
            </div>

            {/* Текстовий блок */}
            <div
                className={`flex-1 min-w-0 ${
                    !hasReasons ? "flex flex-col justify-center" : ""
                }`}
            >
                {/* Заголовок */}
                <div className="font-semibold text-[17px] md:text-[18px] leading-[1.1] tracking-[0.2px] text-[#34495E]">
                    {moodText}
                </div>

                {/* Причини */}
                {hasReasons && (
                    <div className="mt-[2px] text-[15px] leading-[1.25] text-[#555]">
                        {reasonsText}
                    </div>
                )}

                {/* Час */}
                <div className="mt-[2px] text-[13px] leading-[1.2] text-[#7b8386]">
                    Емоція · {time}
                </div>
            </div>

            {/* Кнопка видалення */}
            <button
                onClick={onRemove}
                className="absolute top-1 right-1 w-5 h-5 bg-[#ececec] text-[#444] rounded-full flex items-center justify-center hover:bg-[#ddd] transition"
                title="Видалити"
            >
                <CircleX className="w-4 h-4" />
            </button>
        </div>
    );
}
