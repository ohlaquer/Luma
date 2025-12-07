import { Bookmark, BookmarkCheck, Calendar } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import uk from "date-fns/locale/uk";


registerLocale("uk", uk);

export default function JournalTopBar({
                                          title,
                                          setTitle,
                                          today,
                                          isBookmarked,
                                          setIsBookmarked,
                                          onDateClick,
                                          showCalendar,
                                          onChangeDate,
                                          entryDate,
                                          calendarRef,

                                      }) {
    const days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця", "Субота"];
    const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];

    const formattedDate = entryDate
        ? `${days[entryDate.getDay()]}, ${entryDate.getDate()} ${months[entryDate.getMonth()]} ${entryDate.getFullYear()} р.`
        : "";



    return (
        <div className="flex items-center justify-between px-4 py-3 relative">
            {/* Лівий блок */}
            <div className="flex items-center gap-2 text-[var(--muted)]">
                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--hover)] transition duration-150 cursor-pointer"
                >
                    <Bookmark
                        className={`w-5 h-5 ${isBookmarked ? "text-amber-500 dark:text-amber-400" : "text-[var(--muted)]"}`}
                        fill={isBookmarked ? "currentColor" : "none"}
                    />
                </button>

                <div className="flex items-end justify-between gap-2 w-full border-b border-[var(--hover)] focus-within:border-[var(--primary)] transition">
                    <input
                        type="text"
                        maxLength={40}
                        placeholder="Назва запису"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-sm font-bold bg-transparent focus:outline-none text-[var(--text)] placeholder-[var(--muted)]"
                    />
                    <span
                        className={`text-xs ${
                            title.length >= 40 ? "text-red-500" : "text-[var(--muted)]"
                        }`}
                    >
            {title.length}/40
          </span>
                </div>
            </div>

            {/* Правий блок */}
            <div className="flex items-center gap-2 relative" ref={calendarRef}>
                <span className="text-sm text-[var(--muted)]">{formattedDate}</span>

                <button
                    onClick={onDateClick}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--hover)] transition duration-150 cursor-pointer"
                >
                    <Calendar className="w-5 h-5 text-[var(--muted)]" />
                </button>

                {showCalendar && (
                    <div className="absolute right-0 top-10 z-50">
                        <DatePicker
                            selected={entryDate}
                            onChange={(date) => { onChangeDate(date); onDateClick(); }}
                            inline
                            locale="uk"
                            dateFormat="d MMMM yyyy"
                            calendarClassName="luma-datepicker"
                            dayClassName={(d) => "luma-day"}
                            renderCustomHeader={({
                                                     monthDate, decreaseMonth, increaseMonth
                                                 }) => (
                                <div className="flex items-center justify-between px-2 py-1 border-b border-[var(--hover)]">
                                    <button onClick={decreaseMonth} className="px-2 py-1 rounded hover:bg-[var(--hover)]">‹</button>
                                    <div className="font-semibold text-[var(--text)]">
                                        {monthDate.toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}
                                    </div>
                                    <button onClick={increaseMonth} className="px-2 py-1 rounded hover:bg-[var(--hover)]">›</button>
                                </div>
                            )}
                        />




                    </div>
                )}
            </div>
        </div>
    );
}
