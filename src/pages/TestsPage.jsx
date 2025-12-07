// 📁 src/pages/TestsPage.jsx
import { useState, useMemo, useEffect } from "react";
import tests from "../tests";
import { Link } from "react-router-dom";
import BackLink from "../components/BackLink";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";

// --- картинки тестів ---
import aaq_ii from "../assets/images/tests/aaq-ii.png";
import assigner from "../assets/images/tests/assinger.png";
import beck_anxiety from "../assets/images/tests/beck-anxiety.png";
import beck_depression from "../assets/images/tests/beck-depression.png";
import emotional_intelligence from "../assets/images/tests/emotional-intelligence.png";
import eysenck from "../assets/images/tests/eysenck.png";
import geometric_delinger from "../assets/images/tests/geometric-delinger.png";
import luscher from "../assets/images/tests/luscher.png";
import maslach_burnout from "../assets/images/tests/maslach-burnout.png";
import personal_orientation from "../assets/images/tests/personal-orientation.png";
import personality from "../assets/images/tests/personality.png";
import ptsd_scale from "../assets/images/tests/ptsd-scale.png";
import rosenberg from "../assets/images/tests/rosenberg.png";
import spiellberger_khanin from "../assets/images/tests/spielberger-khanin.png";
import stress_scale from "../assets/images/tests/stress-scale.png";


export default function TestsPage() {

    /* ============================================================
       1) Створюємо початковий масив тестів
    ============================================================ */
    const originalList = useMemo(() => {
        return Object.entries(tests).map(([id, test], index) => ({
            id,
            title: test.title,
            originalIndex: index,
        }));
    }, []);


    /* ============================================================
       2) Читаємо bookmarks з localStorage
    ============================================================ */
    const loadBookmarks = () => {
        try {
            return JSON.parse(localStorage.getItem("testBookmarks") || "{}");
        } catch {
            return {};
        }
    };

    const [bookmarks, setBookmarks] = useState(loadBookmarks);


    /* ============================================================
       3) Зберігаємо bookmarks у localStorage
    ============================================================ */
    useEffect(() => {
        localStorage.setItem("testBookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);


    /* ============================================================
       4) Формуємо відсортований список із закладками нагорі
    ============================================================ */
    const list = useMemo(() => {
        const merged = originalList.map((item) => ({
            ...item,
            bookmarked: Boolean(bookmarks[item.id]),
        }));

        const top = merged.filter((i) => i.bookmarked);

        const bottom = merged
            .filter((i) => !i.bookmarked)
            .sort((a, b) => a.originalIndex - b.originalIndex);

        return [...top, ...bottom];
    }, [originalList, bookmarks]);


    /* ============================================================
       5) Тогл bookmark
    ============================================================ */
    function toggleBookmark(id) {
        setBookmarks((prev) => {
            const updated = { ...prev };
            if (updated[id]) delete updated[id];
            else updated[id] = true;
            return updated;
        });
    }


    /* ============================================================
       6) Мап картинок
    ============================================================ */
    const testImages = {
        "aaq-ii": aaq_ii,
        "assinger": assigner,
        "beck-anxiety": beck_anxiety,
        "beck-depression": beck_depression,
        "emotional-intelligence": emotional_intelligence,
        "eysenck": eysenck,
        "geometric-delinger": geometric_delinger,
        "luscher": luscher,
        "maslach-burnout": maslach_burnout,
        "personal-orientation": personal_orientation,
        "personality": personality,
        "ptsd-scale": ptsd_scale,
        "rosenberg": rosenberg,
        "spiellberger-khanin": spiellberger_khanin,
        "stress-scale": stress_scale,
    };


    /* ============================================================
       7) Render
    ============================================================ */
    return (
        <div
            className="w-full px-4 md:px-8 py-10"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
        >
            <div className="max-w-[880px] mx-auto text-center mb-10">
                <div className="flex justify-center mb-4">
                    <BackLink />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Психологічні тести
                </h1>

                <p
                    className="text-base max-w-3xl mx-auto"
                    style={{ color: "var(--muted-text)" }}
                >
                    Тут зібрані тести, які допоможуть краще зрозуміти себе, свої емоції,
                    реакції та риси характеру. Обери той, що тобі зараз відгукується 👇
                </p>
            </div>

            {/* ===== GRID ===== */}
            <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center max-w-[880px] mx-auto">
                <AnimatePresence mode="popLayout">
                    {list.map((test) => (
                        <motion.div
                            key={test.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Картка */}
                            <Link
                                to={`/cabinet/tests/${test.id}`}
                                className="w-[270px] h-[180px] rounded-2xl overflow-hidden shadow-md transition-transform transform will-change-transform duration-300 ease-out hover:scale-[1.02] hover:brightness-105 hover:shadow-lg flex flex-col"
                                style={{
                                    backgroundColor: "var(--card-bg)",
                                    color: "var(--card-text)",
                                }}
                            >
                                <div className="relative flex-grow">
                                    <img
                                        src={testImages[test.id] || luscher}
                                        alt={test.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div
                                    className="text-center py-2 text-sm font-medium backdrop-blur-sm transition-colors duration-300"
                                    style={{
                                        backgroundColor: "var(--card-overlay)",
                                        color: "var(--card-text)",
                                    }}
                                >
                                    {test.title}
                                </div>
                            </Link>

                            {/* ⭐ Bookmark */}
                            <button
                                onClick={() => toggleBookmark(test.id)}
                                className="absolute top-2 right-2 z-20 p-1.5 rounded-full transition"
                            >
                                <Bookmark
                                    className={`
            w-5 h-5 transition duration-200 
            ${test.bookmarked ? "text-amber-500 drop-shadow-[0_0_6px_rgba(255,200,0,0.5)]" : "text-[var(--muted)]"} 
            hover:drop-shadow-[0_0_6px_rgba(255,200,0,0.4)]
            hover:text-amber-400
        `}
                                    fill={test.bookmarked ? "currentColor" : "none"}
                                />
                            </button>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>
        </div>
    );
}
