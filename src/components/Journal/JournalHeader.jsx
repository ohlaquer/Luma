import {
    Plus,
    CalendarDays,
    Quote,
    Search,
    StickyNote
} from "lucide-react";
import { pluralize } from "./pluralize";
import JournalSortMenu from "./JournalSortMenu";

export default function JournalHeader({
                                          entryCount = 0,
                                          wordCount = 0,
                                          dayCount = 0,
                                          onAddClick,
                                          // ↓ ось нові пропи
                                          sortBy = "date-new",
                                          onSortChange,
                                          onSearchClick = () => {},   // ← ДОДАЛИ
                                      }) {
    return (
        <div
            className="
    w-full
    bg-[var(--header-light)] dark:bg-[var(--header-dark)]
    border border-[var(--hover)]
    shadow-md rounded-xl py-3 sm:py-4 px-4 sm:px-6
  "
        >

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">

            {/* Ліва частина: Назва */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">
                    Щоденник
                </h1>

                {/* Права частина: Статистика і кнопки */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5 text-[var(--text)] text-sm sm:text-base">


                {/* Кількість записів */}
                    <div className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5" />
                        <div className="flex flex-col leading-none">
                            <span className="font-medium text-sm">{entryCount}</span>
                            <span className="text-xs text-[var(--muted)]">
                {pluralize(entryCount, ["запис", "записи", "записів"])} цього року
              </span>
                        </div>
                    </div>

                    {/* Кнопка + */}
                    <button
                        onClick={onAddClick}
                        className="bg-[var(--text)] hover:opacity-90 transition text-[var(--bg)]
             w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                    >
                        <Plus size={20} className="sm:w-[18px] sm:h-[18px]" />
                    </button>


                    {/* Кількість слів */}
                    <div className="flex items-center gap-2">
                        <Quote className="w-5 h-5" />
                        <div className="flex flex-col leading-none">
              <span className="font-medium text-sm">
                {wordCount.toLocaleString("uk-UA")}
              </span>
                            <span className="text-xs text-[var(--muted)]">
                {pluralize(wordCount, ["слово", "слова", "слів"])} записано
              </span>
                        </div>
                    </div>

                    {/* Кількість днів */}
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        <div className="flex flex-col leading-none">
                            <span className="font-medium text-sm">{dayCount}</span>
                            <span className="text-xs text-[var(--muted)]">
                {pluralize(dayCount, ["день", "дні", "днів"])} записів
              </span>
                        </div>
                    </div>

                    {/* Пошук і меню */}
                    <button
                        onClick={onSearchClick}
                        className="p-1 rounded hover:bg-[var(--hover)] transition"
                        title="Пошук"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {/* ⬇️ замість сирої іконки */}
                    <JournalSortMenu value={sortBy} onChange={onSortChange} />
                </div>
            </div>
        </div>
    );
}
