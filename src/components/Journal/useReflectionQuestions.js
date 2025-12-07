import { useState, useEffect } from "react";
import reflectionQuestions from "./journalQuestions";

export default function useReflectionQuestions() {
    const STORAGE_KEY = "reflectionQuestionsState";
    const DATE_KEY = "reflectionQuestionsDate";
    const todayStr = new Date().toISOString().split("T")[0];

    // Перевірка і завантаження з localStorage
    const savedState = (() => {
        try {
            const storedDate = localStorage.getItem(DATE_KEY);
            const data = localStorage.getItem(STORAGE_KEY);

            if (storedDate === todayStr && data) {
                const parsed = JSON.parse(data);
                // Переконуємось, що формат правильний і є рівно 4 питання
                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (b) => Array.isArray(b.questions) && b.questions.length === 4
                    )
                ) {
                    return parsed;
                }
            }
        } catch {}
        return null;
    })();

    const [loading, setLoading] = useState([false, false, false, false]);

    // Генерація або завантаження
    const [questionsByCategory, setQuestionsByCategory] = useState(() => {
        if (savedState) return savedState;

        // Створюємо нову четвірку для кожної категорії
        return reflectionQuestions.map((block) => {
            const all = [...block.questions];
            const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 4);
            return {
                category: block.category,
                questions: shuffled,
                currentIndex: 0,
                bg: block.bg,
            };
        });
    });

    // Збереження у localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(questionsByCategory));
            localStorage.setItem(DATE_KEY, todayStr);
        } catch {}
    }, [questionsByCategory, todayStr]);

    // Крутіння по колу тільки в межах 4 питань
    const handleRegenerate = (index) => {
        setLoading((prev) => {
            const copy = [...prev];
            copy[index] = true;
            return copy;
        });

        setTimeout(() => {
            setQuestionsByCategory((prev) => {
                const updated = [...prev];
                const block = updated[index];
                const nextIndex = (block.currentIndex + 1) % block.questions.length;

                updated[index] = {
                    ...block,
                    currentIndex: nextIndex,
                };
                return updated;
            });

            setLoading((prev) => {
                const copy = [...prev];
                copy[index] = false;
                return copy;
            });
        }, 400);
    };

    // Повертаємо масив поточних питань
    const currentQuestions = questionsByCategory.map(
        (block) => block.questions[block.currentIndex]
    );

    return { questionsByCategory, currentQuestions, loading, handleRegenerate };
}
