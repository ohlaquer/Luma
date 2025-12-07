import { Popover } from "@headlessui/react";
import {
    CalendarArrowDown, CalendarArrowUp,
    ArrowUpAZ, ArrowDownZA,
    Smile, Frown,
    ImageDown, ImageUp,
    SlidersHorizontal, Bookmark,
} from "lucide-react";

const SORT_GROUPS = [
    {
        title: "Дата",
        items: [
            { value: "date-new", label: "Новіші зверху", icon: CalendarArrowDown },
            { value: "date-old", label: "Старіші зверху", icon: CalendarArrowUp },
        ],
    },
    {
        title: "Назва",
        items: [
            { value: "title-az", label: "A → Я", icon: ArrowUpAZ },
            { value: "title-za", label: "Я → A", icon: ArrowDownZA },
        ],
    },
    {
        title: "Настрій",
        items: [
            { value: "mood-pos", label: "Від позитивних", icon: Smile },
            { value: "mood-neg", label: "Від негативних", icon: Frown },
        ],
    },
    {
        title: "Закладки",
        items: [
            { value: "bookmark-first", label: "Спочатку закладені", icon: Bookmark },
        ],
    },
    {
        title: "Медіа",
        items: [
            { value: "media-first", label: "Спочатку з фото", icon: ImageDown },
            { value: "media-last", label: "Спочатку без фото", icon: ImageUp },
        ],
    },
];

export default function JournalSortMenu({ value = "date-new", onChange }) {
    return (
        <Popover className="relative">
            {/* Кнопка відкриття */}
            <Popover.Button
                aria-label="Меню сортування"
                className="p-2 rounded-full hover:bg-[var(--hover)] transition"
            >
                <SlidersHorizontal className="w-5 h-5" />
            </Popover.Button>

            {/* Меню */}
            <Popover.Panel
                className="
        SortPopoverFix compact-sort
        absolute
        top-0

        left-full ml-3
        z-50

        w-max max-w-[90vw] sm:w-64
        bg-[var(--bg)]
        border border-[var(--hover)]
        shadow-2xl rounded-2xl p-2
        flex flex-col gap-2
        max-h-[60vh]
        overflow-y-auto
        origin-left
        transition-all duration-200 ease-out
        data-[headlessui-state=open]:scale-100 scale-95
        "
            >

            <h3 className="text-center text-sm font-semibold text-[var(--text)] mb-1">
                    Сортувати записи
                </h3>

                <div className="h-px bg-[var(--hover)]" />

                {SORT_GROUPS.map((group, gi) => (
                    <div key={group.title}>
                        <div className="px-2 pt-2 pb-1 text-[var(--muted)] text-xs font-semibold tracking-wide">
                            {group.title}
                        </div>

                        <div className="grid gap-2 px-2 pb-2">
                            {group.items.map((item) => (
                                <Popover.Button
                                    as="button"
                                    key={item.value}
                                    onClick={() => onChange?.(item.value)}
                                    className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2
                  bg-[var(--header-light)] dark:bg-[var(--header-dark)]
                  border border-[var(--hover)] shadow-sm transition
                  ${
                                        value === item.value
                                            ? "ring-1 ring-[var(--accent)]/40"
                                            : "hover:bg-[var(--hover)]"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon
                                            className={`w-4 h-4 ${
                                                value === item.value
                                                    ? "text-[var(--accent)]"
                                                    : "text-[var(--muted)]"
                                            }`}
                                        />
                                        <span className="truncate">{item.label}</span>
                                    </div>
                                </Popover.Button>
                            ))}
                        </div>

                        {gi !== SORT_GROUPS.length - 1 && (
                            <div className="my-2 h-px bg-[var(--hover)] rounded-full" />
                        )}
                    </div>
                ))}

                {/* 📱 кнопка "Закрити" */}
                <Popover.Button
                    className="sm:hidden mt-4 w-full py-3 rounded-xl text-sm font-medium transition-all duration-200
  bg-[var(--accent)] text-black dark:text-white
  hover:brightness-105 active:scale-[0.98]"
                >
                    Закрити
                </Popover.Button>

            </Popover.Panel>
        </Popover>
    );
}
